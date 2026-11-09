import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  passwordAuthService: { requestRegistration: vi.fn() },
  rateLimiter: { hit: vi.fn() },
}));

vi.mock("../../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run(mocks),
}));

import { dynamic, POST } from "./route";
import { ServiceUnavailableError } from "@devmentor/core";

const CSRF = { "content-type": "application/json", "x-devmentor-csrf": "1" };

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { ...CSRF, ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.passwordAuthService.requestRegistration.mockReset().mockResolvedValue(undefined);
  mocks.rateLimiter.hit.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("TRUST_PROXY_HOPS", "0");
});

afterEach(() => vi.unstubAllEnvs());

describe("POST /api/auth/register", () => {
  it("is force-dynamic and exports only POST", async () => {
    expect(dynamic).toBe("force-dynamic");
    const route = await import("./route");
    expect(Object.keys(route).filter((key) => ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key))).toEqual(["POST"]);
  });

  it("returns the same generic confirmation message and limits by e-mail when no trusted IP exists", async () => {
    const response = await POST(request({ email: " ADA@Example.Test ", displayName: "Ada" }), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { message: "Check your e-mail for next steps." } });
    expect(mocks.rateLimiter.hit).toHaveBeenCalledTimes(1);
    expect(mocks.rateLimiter.hit).toHaveBeenCalledWith("register:email:ada%40example.test", { maxHits: 3, windowSeconds: 3600 });
    expect(mocks.passwordAuthService.requestRegistration).toHaveBeenCalledWith({ email: "ada@example.test", displayName: "Ada" });
  });

  it("uses only the configured trusted proxy hop for the per-IP bucket", async () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    const response = await POST(request(
      { email: "ada@example.test", displayName: "Ada" },
      { "x-forwarded-for": "198.51.100.77, 10.0.0.4" },
    ), undefined);

    expect(response.status).toBe(200);
    expect(mocks.rateLimiter.hit).toHaveBeenNthCalledWith(1, "register:ip:10.0.0.4", { maxHits: 5, windowSeconds: 3600 });
    expect(mocks.rateLimiter.hit).toHaveBeenNthCalledWith(2, "register:email:ada%40example.test", { maxHits: 3, windowSeconds: 3600 });
  });

  it("returns the limiter's retry delay without sending registration mail", async () => {
    mocks.rateLimiter.hit.mockResolvedValue({ allowed: false, retryAfterSeconds: 42 });
    const response = await POST(request({ email: "ada@example.test", displayName: "Ada" }), undefined);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("42");
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(mocks.passwordAuthService.requestRegistration).not.toHaveBeenCalled();
  });

  it("does not disclose whether an e-mail already has an account when mailing fails", async () => {
    mocks.passwordAuthService.requestRegistration.mockRejectedValue(new ServiceUnavailableError("Service temporarily unavailable"));
    const response = await POST(request({ email: "ada@example.test", displayName: "Ada" }), undefined);
    expect(response.status).toBe(503);
    const body: unknown = await response.json();
    expect(body).toEqual({ ok: false, error: { code: "SERVICE_UNAVAILABLE", message: "Service temporarily unavailable" } });
    expect(JSON.stringify(body)).not.toMatch(/already|registered|existing/i);
  });

  it("rejects invalid input before rate limiting", async () => {
    const response = await POST(request({ email: "not-an-email", displayName: "Ada" }), undefined);
    expect(response.status).toBe(400);
    expect(mocks.rateLimiter.hit).not.toHaveBeenCalled();
    expect(mocks.passwordAuthService.requestRegistration).not.toHaveBeenCalled();
  });
});
