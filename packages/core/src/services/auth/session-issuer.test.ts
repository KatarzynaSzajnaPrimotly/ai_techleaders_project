import { afterEach, describe, expect, it, vi } from "vitest";
import { verifySession, SESSION_TTL_SECONDS } from "../../http/auth";
import { ServiceUnavailableError } from "../../http/errors";
import type { User } from "./user.types";
import { effectiveRole, issueSession } from "./session-issuer";

const SECRET = "session-issuer-test-secret-that-is-at-least-32-characters";
const user: Pick<User, "id" | "role"> = { id: "user-1", role: "mentor" };

afterEach(() => vi.unstubAllEnvs());

describe("session issuer", () => {
  it("keeps the stored role as the effective role before operator allowlist is implemented", () => {
    expect(effectiveRole({ role: "mentee" })).toBe("mentee");
    expect(effectiveRole({ role: "mentor" })).toBe("mentor");
  });

  it("issues a signed session and a secure production cookie with the fixed lifetime", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
    const issued = await issueSession(user);

    await expect(verifySession(issued.token, SECRET)).resolves.toEqual({ userId: "user-1", role: "mentor" });
    expect(issued.session).toEqual({ userId: "user-1", role: "mentor" });
    expect(issued.cookie).toContain("devmentor_session=");
    expect(issued.cookie).toContain("HttpOnly");
    expect(issued.cookie).toContain("SameSite=Lax");
    expect(issued.cookie).toContain("Path=/");
    expect(issued.cookie).toContain(`Max-Age=${SESSION_TTL_SECONDS}`);
    expect(issued.cookie).toContain("Secure");
  });

  it("omits Secure outside production and when the test-only HTTP flag is enabled", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    vi.stubEnv("NODE_ENV", "development");
    expect((await issueSession(user)).cookie).not.toContain("Secure");

    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    vi.stubEnv("APP_URL", "http://127.0.0.1:4000");
    expect((await issueSession(user)).cookie).not.toContain("Secure");
  });

  it("fails with the typed unavailable error when the session secret is missing", async () => {
    vi.stubEnv("JWT_SECRET", "");
    await expect(issueSession(user)).rejects.toBeInstanceOf(ServiceUnavailableError);
  });
});
