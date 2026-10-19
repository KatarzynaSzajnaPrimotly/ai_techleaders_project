import { SignJWT } from "jose";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertOwns,
  buildSessionCookie,
  clearSessionCookie,
  requireRole,
  requireSession,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
} from "./auth";

afterEach(() => {
  vi.unstubAllEnvs();
});

const SECRET = "s".repeat(32);
const session = { userId: "user-1", role: "mentor" };
const withCookie = (cookie?: string) =>
  new Request("http://x", { headers: cookie === undefined ? {} : { cookie } });

describe("signSession / verifySession", () => {
  it("round-trips the session", async () => {
    const token = await signSession(session, SECRET);
    await expect(verifySession(token, SECRET)).resolves.toEqual(session);
  });

  it("rejects a token signed with another secret", async () => {
    const token = await signSession(session, "x".repeat(32));
    await expect(verifySession(token, SECRET)).rejects.toMatchObject({ name: "UnauthorizedError", status: 401 });
  });

  it("rejects an expired token", async () => {
    const token = await signSession(session, SECRET, -10);
    await expect(verifySession(token, SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("rejects garbage", async () => {
    await expect(verifySession("not-a-jwt", SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("rejects tokens without the expected claims", async () => {
    const key = new TextEncoder().encode(SECRET);
    const noRole = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject("u").sign(key);
    const noSubject = await new SignJWT({ role: "mentor" }).setProtectedHeader({ alg: "HS256" }).sign(key);
    await expect(verifySession(noRole, SECRET)).rejects.toMatchObject({ status: 401 });
    await expect(verifySession(noSubject, SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("rejects an unsigned token (alg none)", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ sub: "u", role: "admin" })).toString("base64url");
    await expect(verifySession(`${header}.${payload}.`, SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("uses a 24 hour lifetime by default", () => {
    expect(SESSION_TTL_SECONDS).toBe(86_400);
  });
});

describe("requireSession", () => {
  it("returns the session from the cookie among other cookies", async () => {
    const token = await signSession(session, SECRET);
    const request = withCookie(`theme=dark; ${SESSION_COOKIE}=${token}; other=1`);
    await expect(requireSession(request, SECRET)).resolves.toEqual(session);
  });

  it("is unauthorized without a cookie header", async () => {
    await expect(requireSession(withCookie(), SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("is unauthorized when the session cookie is absent", async () => {
    await expect(requireSession(withCookie("theme=dark"), SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("is unauthorized for an invalid token", async () => {
    await expect(requireSession(withCookie(`${SESSION_COOKIE}=bogus`), SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("reads the secret from the environment by default", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signSession(session, SECRET);
    await expect(requireSession(withCookie(`${SESSION_COOKIE}=${token}`))).resolves.toEqual(session);
  });
});

describe("authorization helpers", () => {
  it("requireRole allows a matching role and denies another", () => {
    expect(() => requireRole(session, "mentor")).not.toThrow();
    expect(() => requireRole(session, "admin")).toThrowError(expect.objectContaining({ status: 403 }));
  });

  it("assertOwns allows only the owner and fails closed otherwise", () => {
    expect(() => assertOwns(session, "user-1")).not.toThrow();
    expect(() => assertOwns(session, "user-2")).toThrowError(expect.objectContaining({ status: 403 }));
    expect(() => assertOwns(session, undefined)).toThrowError(expect.objectContaining({ status: 403 }));
    expect(() => assertOwns(session, null)).toThrowError(expect.objectContaining({ status: 403 }));
    expect(() => assertOwns(session, "")).toThrowError(expect.objectContaining({ status: 403 }));
  });
});

describe("session cookie", () => {
  it("is HttpOnly, SameSite=Lax and scoped, with the default lifetime", () => {
    const cookie = buildSessionCookie("tok", { secure: false });
    expect(cookie).toBe(`${SESSION_COOKIE}=tok; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`);
  });

  it("adds Secure in production", () => {
    expect(buildSessionCookie("tok", { secure: true })).toContain("; Secure");
  });

  it("supports a custom lifetime", () => {
    expect(buildSessionCookie("tok", { secure: false, maxAgeSeconds: 60 })).toContain("Max-Age=60");
  });

  it("can be cleared", () => {
    const cookie = clearSessionCookie(true);
    expect(cookie).toContain(`${SESSION_COOKIE}=;`);
    expect(cookie).toContain("Max-Age=0");
    expect(cookie).toContain("Secure");
  });
});
