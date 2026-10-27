import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dynamic, POST } from "./route";

const CSRF = { "x-devmentor-csrf": "1" };

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
});

afterEach(() => vi.unstubAllEnvs());

function logout(headers: Record<string, string> = CSRF): Request {
  return new Request("http://localhost/api/auth/logout", { method: "POST", headers });
}

describe("POST /api/auth/logout", () => {
  it("is rendered on demand", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("is idempotent and clears the session even without a cookie", async () => {
    const response = await POST(logout(), undefined);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { loggedOut: true } });
    expect(response.headers.get("set-cookie")).toContain("devmentor_session=;");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=Lax");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("clears stale cookies without needing to validate the session", async () => {
    const response = await POST(logout({ ...CSRF, cookie: "devmentor_session=stale-token" }), undefined);

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("devmentor_session=;");
  });

  it("requires the CSRF header before clearing the cookie", async () => {
    const response = await POST(logout({ cookie: "devmentor_session=stale-token" }), undefined);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("uses Secure in production unless the test-only insecure HTTP flag is enabled", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const secure = await POST(logout(), undefined);
    expect(secure.headers.get("set-cookie")).toContain("Secure");

    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    vi.stubEnv("APP_URL", "http://127.0.0.1:3000");
    const insecure = await POST(logout(), undefined);
    expect(insecure.headers.get("set-cookie")).not.toContain("Secure");
  });
});
