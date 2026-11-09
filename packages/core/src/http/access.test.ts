import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "../logger";
import { signSession, SESSION_COOKIE, type Session } from "./auth";
import { enforceAccess } from "./access";

afterEach(() => {
  vi.unstubAllEnvs();
  delete (globalThis as typeof globalThis & { __devmentor_warned_public_cookie_without_secret?: boolean })
    .__devmentor_warned_public_cookie_without_secret;
});

const SECRET = "s".repeat(32);
const mentee: Session = { userId: "mentee-1", role: "mentee", sessionVersion: 0 };
const mentor: Session = { userId: "mentor-1", role: "mentor", sessionVersion: 0 };
const request = (cookie?: string) =>
  new Request("http://devmentor.test/api/example", { headers: cookie === undefined ? {} : { cookie } });
const currentSession = async (session: Session) => session;

describe("enforceAccess", () => {
  it("does not read the JWT secret for public requests without a session cookie", async () => {
    vi.stubEnv("JWT_SECRET", "");

    await expect(enforceAccess(request(), "public")).resolves.toBeNull();
  });

  it("returns a valid optional session for public access", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signSession(mentee, SECRET);

    await expect(enforceAccess(request(`${SESSION_COOKIE}=${token}`), "public")).resolves.toEqual(mentee);
  });

  it("treats malformed and expired public cookies as anonymous", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const expired = await signSession(mentee, SECRET, -10);

    await expect(enforceAccess(request(`${SESSION_COOKIE}=not-a-token`), "public")).resolves.toBeNull();
    await expect(enforceAccess(request(`${SESSION_COOKIE}=${expired}`), "public")).resolves.toBeNull();
  });

  it("warns once and treats public requests with cookies as anonymous when the secret is missing", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    const withCookie = request(`${SESSION_COOKIE}=unverifiable`);

    await expect(enforceAccess(withCookie, "public")).resolves.toBeNull();
    await expect(enforceAccess(withCookie, "public")).resolves.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("Session ignored on public route because JWT_SECRET is not configured");
    expect(
      (globalThis as typeof globalThis & { __devmentor_warned_public_cookie_without_secret?: boolean })
        .__devmentor_warned_public_cookie_without_secret,
    ).toBe(true);
  });

  it("rethrows unexpected errors while inspecting a public session", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    let headerReads = 0;
    const brokenRequest = {
      headers: {
        get: () => {
          headerReads += 1;
          if (headerReads === 1) return `${SESSION_COOKIE}=present`;
          throw new Error("Unexpected request failure");
        },
      },
    } as unknown as Request;

    await expect(enforceAccess(brokenRequest, "public")).rejects.toThrow("Unexpected request failure");
  });

  it("returns a session for authenticated access", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signSession(mentee, SECRET);

    await expect(enforceAccess(request(`${SESSION_COOKIE}=${token}`), "authenticated", currentSession)).resolves.toEqual(mentee);
  });

  it("uses the current account session and rejects a deleted or invalidated account", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signSession(mentee, SECRET);
    const cookie = request(`${SESSION_COOKIE}=${token}`);
    const current = vi.fn(async (session: Session) => session);
    await expect(enforceAccess(cookie, { roles: ["mentee"] }, current)).resolves.toEqual(mentee);
    expect(current).toHaveBeenCalledWith(mentee);
    await expect(enforceAccess(cookie, "authenticated", async () => null)).rejects.toMatchObject({ status: 401 });
  });

  it("treats an invalidated optional public session as anonymous", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signSession(mentee, SECRET);
    await expect(
      enforceAccess(request(`${SESSION_COOKIE}=${token}`), "public", async () => null),
    ).resolves.toBeNull();
  });

  it("requires configuration before deciding whether guarded access is anonymous", async () => {
    vi.stubEnv("JWT_SECRET", "");

    await expect(enforceAccess(request(), "authenticated", currentSession)).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      status: 503,
    });
    await expect(enforceAccess(request(), { roles: ["mentor"] }, currentSession)).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      status: 503,
    });
  });

  it("fails closed when guarded access has no current-session resolver", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signSession(mentee, SECRET);

    await expect(enforceAccess(request(`${SESSION_COOKIE}=${token}`), "authenticated")).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      status: 503,
    });
  });

  it("requires a session for guarded access", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);

    await expect(enforceAccess(request(), "authenticated", currentSession)).rejects.toMatchObject({ status: 401 });
    await expect(enforceAccess(request(`${SESSION_COOKIE}=invalid`), { roles: ["mentor"] }, currentSession)).rejects.toMatchObject({
      status: 401,
    });
  });

  it("allows listed roles and rejects roles outside the access declaration", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const mentorToken = await signSession(mentor, SECRET);
    const menteeToken = await signSession(mentee, SECRET);

    await expect(
      enforceAccess(request(`${SESSION_COOKIE}=${mentorToken}`), { roles: ["mentor", "operator"] }, currentSession),
    ).resolves.toEqual(mentor);
    await expect(enforceAccess(request(`${SESSION_COOKIE}=${menteeToken}`), { roles: ["mentor"] }, currentSession)).rejects.toMatchObject({
      status: 403,
    });
  });
});
