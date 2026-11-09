import { afterEach, describe, expect, it, vi } from "vitest";
import { verifySession, SESSION_TTL_SECONDS } from "../../http/auth";
import { ServiceUnavailableError } from "../../http/errors";
import type { User } from "./user.types";
import { effectiveRole, issueSession } from "./session-issuer";

const SECRET = "session-issuer-test-secret-that-is-at-least-32-characters";
const user: Pick<User, "id" | "email" | "role" | "sessionVersion"> = {
  id: "user-1", email: "mentor@example.test", role: "mentor", sessionVersion: 0,
};

afterEach(() => vi.unstubAllEnvs());

describe("session issuer", () => {
  it.each([
    ["mentee", "person@example.test", [], "mentee"],
    ["mentee", "founder@example.test", ["founder@example.test"], "operator"],
    ["mentor", "person@example.test", [], "mentor"],
    ["mentor", "founder@example.test", ["founder@example.test"], "mentor"],
  ] as const)("derives the effective role for stored role %s and e-mail %s", (role, email, operatorEmails, expected) => {
    expect(effectiveRole({ role, email }, operatorEmails)).toBe(expected);
  });

  it("uses OPERATOR_EMAILS when issuing a session and preserves a listed mentor role", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    vi.stubEnv("OPERATOR_EMAILS", " FOUNDER@example.test ");
    const operator = await issueSession({ id: "founder", email: "founder@example.test", role: "mentee", sessionVersion: 0 });
    const mentor = await issueSession({ id: "mentor", email: "founder@example.test", role: "mentor", sessionVersion: 0 });
    expect(operator.session.role).toBe("operator");
    expect(mentor.session.role).toBe("mentor");
  });

  it("issues a signed session and a secure production cookie with the fixed lifetime", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
    const issued = await issueSession(user);

    await expect(verifySession(issued.token, SECRET)).resolves.toEqual({ userId: "user-1", role: "mentor", sessionVersion: 0 });
    expect(issued.session).toEqual({ userId: "user-1", role: "mentor", sessionVersion: 0 });
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
