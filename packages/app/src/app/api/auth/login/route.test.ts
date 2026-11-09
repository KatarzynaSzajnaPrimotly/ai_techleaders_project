import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  passwordAuthService: { authenticate: vi.fn() },
  rateLimiter: { hit: vi.fn() },
}));

vi.mock("../../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run(mocks),
}));

import { SESSION_COOKIE, ServiceUnavailableError, UnauthorizedError, verifySession } from "@devmentor/core";
import { dynamic, POST } from "./route";

const APP_URL = "https://devmentor.example";
const JWT_SECRET = "login-route-test-secret-long-enough-for-hs256";
const CSRF = { "content-type": "application/json", "x-devmentor-csrf": "1" };

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { ...CSRF, ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.passwordAuthService.authenticate.mockReset().mockResolvedValue({ id: "user-1", email: "ada@example.test", role: "mentee", sessionVersion: 0 });
  mocks.rateLimiter.hit.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  vi.stubEnv("APP_URL", APP_URL);
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("TRUST_PROXY_HOPS", "0");
});

afterEach(() => vi.unstubAllEnvs());

describe("POST /api/auth/login", () => {
  it("is force-dynamic and exports only POST", async () => {
    expect(dynamic).toBe("force-dynamic");
    const route = await import("./route");
    expect(Object.keys(route).filter((key) => ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key))).toEqual(["POST"]);
  });

  it("does not charge successful logins against the e-mail failure bucket when no IP is trusted", async () => {
    const response = await POST(request({ email: " ADA@Example.Test ", password: "a long enough password", returnTo: "/mentor/sessions" }), undefined);
    expect(response.status).toBe(200);
    expect(mocks.rateLimiter.hit).not.toHaveBeenCalled();
    expect(mocks.passwordAuthService.authenticate).toHaveBeenCalledWith("ada@example.test", "a long enough password");
    await expect(response.json()).resolves.toMatchObject({ ok: true, data: { redirectTo: "/mentor/sessions" } });
    const cookie = response.headers.get("set-cookie") ?? "";
    const token = cookie.split(";", 1)[0]?.slice(`${SESSION_COOKIE}=`.length);
    await expect(verifySession(token ?? "", JWT_SECRET)).resolves.toEqual({ userId: "user-1", role: "mentee", sessionVersion: 0 });
  });

  it("ignores an unsafe returnTo and falls back to the user's role home", async () => {
    const response = await POST(request({ email: "ada@example.test", password: "a long enough password", returnTo: "https://evil.example/steal" }), undefined);
    await expect(response.json()).resolves.toMatchObject({ ok: true, data: { redirectTo: "/home" } });
  });

  it("propagates non-credential authentication failures without charging the failure bucket", async () => {
    mocks.passwordAuthService.authenticate.mockRejectedValue(new ServiceUnavailableError());
    const response = await POST(request({ email: "ada@example.test", password: "a long enough password" }), undefined);
    expect(response.status).toBe(503);
    expect(mocks.rateLimiter.hit).not.toHaveBeenCalled();
  });

  it("does not hide invalid application URL configuration while validating a returnTo", async () => {
    vi.stubEnv("APP_URL", "not a url");
    const response = await POST(request({ email: "ada@example.test", password: "a long enough password", returnTo: "/home" }), undefined);
    expect(response.status).toBe(503);
    expect(response.headers.has("set-cookie")).toBe(false);
  });

  it("charges the IP-wide request bucket but not the e-mail failure bucket on success", async () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    const response = await POST(request(
      { email: "ada@example.test", password: "a long enough password" },
      { "x-forwarded-for": "198.51.100.77, 10.0.0.4" },
    ), undefined);
    expect(response.status).toBe(200);
    expect(mocks.rateLimiter.hit).toHaveBeenCalledTimes(1);
    expect(mocks.rateLimiter.hit).toHaveBeenCalledWith("login:ip:10.0.0.4", { maxHits: 30, windowSeconds: 900 });
  });

  it("returns Retry-After before authentication when the IP-wide bucket is limited", async () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    mocks.rateLimiter.hit.mockResolvedValue({ allowed: false, retryAfterSeconds: 77 });
    const response = await POST(request(
      { email: "ada@example.test", password: "a long enough password" },
      { "x-forwarded-for": "10.0.0.4" },
    ), undefined);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("77");
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(mocks.passwordAuthService.authenticate).not.toHaveBeenCalled();
  });

  it("charges the IP-and-e-mail failure bucket only after invalid credentials", async () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    mocks.rateLimiter.hit
      .mockResolvedValueOnce({ allowed: true, retryAfterSeconds: 0 })
      .mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 33 });
    mocks.passwordAuthService.authenticate.mockRejectedValue(new UnauthorizedError("Invalid credentials"));
    const response = await POST(request(
      { email: "ada@example.test", password: "a long enough password" },
      { "x-forwarded-for": "10.0.0.4" },
    ), undefined);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("33");
    expect(mocks.rateLimiter.hit).toHaveBeenNthCalledWith(1, "login:ip:10.0.0.4", { maxHits: 30, windowSeconds: 900 });
    expect(mocks.rateLimiter.hit).toHaveBeenNthCalledWith(2, "login:ip-email:10.0.0.4:ada%40example.test", { maxHits: 5, windowSeconds: 900 });
  });

  it("returns the same generic failure and no cookie for invalid credentials", async () => {
    mocks.passwordAuthService.authenticate.mockRejectedValue(new UnauthorizedError("Invalid credentials"));
    const response = await POST(request({ email: "unknown@example.test", password: "a long enough password" }), undefined);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ ok: false, error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(mocks.rateLimiter.hit).toHaveBeenCalledWith("login:email:unknown%40example.test", { maxHits: 5, windowSeconds: 900 });
  });

  it("rejects a malformed request before authentication", async () => {
    const response = await POST(request({ email: "ada@example.test", password: "" }), undefined);
    expect(response.status).toBe(400);
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(mocks.passwordAuthService.authenticate).not.toHaveBeenCalled();
  });
});
