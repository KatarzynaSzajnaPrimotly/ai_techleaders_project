import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  passwordAuthService: { confirmRegistration: vi.fn() },
  rateLimiter: { hit: vi.fn() },
}));

vi.mock("../../../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run(mocks),
}));

import { SESSION_COOKIE, UnauthorizedError, verifySession } from "@devmentor/core";
import { dynamic, POST } from "./route";

const APP_URL = "https://devmentor.example";
const JWT_SECRET = "confirm-route-test-secret-long-enough-for-hs256";
const CSRF = { "content-type": "application/json", "x-devmentor-csrf": "1" };

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/auth/register/confirm", {
    method: "POST",
    headers: { ...CSRF, ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.passwordAuthService.confirmRegistration.mockReset().mockResolvedValue({ account: { id: "user-1", email: "ada@example.test", role: "mentee" }, returnTo: "/mentor/sessions" });
  mocks.rateLimiter.hit.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  vi.stubEnv("APP_URL", APP_URL);
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("TRUST_PROXY_HOPS", "0");
});

afterEach(() => vi.unstubAllEnvs());

describe("POST /api/auth/register/confirm", () => {
  it("is force-dynamic and exports only POST", async () => {
    expect(dynamic).toBe("force-dynamic");
    const route = await import("./route");
    expect(Object.keys(route).filter((key) => ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key))).toEqual(["POST"]);
  });

  it("creates a session and returns the safe requested destination", async () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    const response = await POST(request(
      { token: "registration-token", password: "a long enough password" },
      { "x-forwarded-for": "10.0.0.4" },
    ), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { redirectTo: "/mentor/sessions" } });
    expect(mocks.rateLimiter.hit).toHaveBeenCalledWith("register-confirm:ip:10.0.0.4", { maxHits: 10, windowSeconds: 3600 });
    expect(mocks.passwordAuthService.confirmRegistration).toHaveBeenCalledWith("registration-token", "a long enough password");
    const cookie = response.headers.get("set-cookie") ?? "";
    const token = cookie.split(";", 1)[0]?.slice(`${SESSION_COOKIE}=`.length);
    await expect(verifySession(token ?? "", JWT_SECRET)).resolves.toEqual({ userId: "user-1", role: "mentee" });
  });

  it("uses the role home when the confirmed registration has no returnTo", async () => {
    mocks.passwordAuthService.confirmRegistration.mockResolvedValue({ account: { id: "user-2", email: "mentor@example.test", role: "mentor" } });
    const response = await POST(request({ token: "registration-token", password: "a long enough password" }), undefined);
    await expect(response.json()).resolves.toMatchObject({ ok: true, data: { redirectTo: "/mentor" } });
  });

  it("returns Retry-After without issuing a session when the IP bucket is limited", async () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    mocks.rateLimiter.hit.mockResolvedValue({ allowed: false, retryAfterSeconds: 53 });
    const response = await POST(request(
      { token: "registration-token", password: "a long enough password" },
      { "x-forwarded-for": "10.0.0.4" },
    ), undefined);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("53");
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(mocks.passwordAuthService.confirmRegistration).not.toHaveBeenCalled();
  });

  it("keeps replay/conflict failures generic and issues no cookie", async () => {
    mocks.passwordAuthService.confirmRegistration.mockRejectedValue(new UnauthorizedError("This link has already been used. Please sign in."));
    const response = await POST(request({ token: "replayed-token", password: "a long enough password" }), undefined);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "UNAUTHORIZED", message: "This link has already been used. Please sign in." },
    });
    expect(response.headers.has("set-cookie")).toBe(false);
  });

  it("rejects malformed input before checking the rate limiter", async () => {
    const response = await POST(request({ token: "", password: "short" }), undefined);
    expect(response.status).toBe(400);
    expect(mocks.rateLimiter.hit).not.toHaveBeenCalled();
    expect(mocks.passwordAuthService.confirmRegistration).not.toHaveBeenCalled();
  });
});
