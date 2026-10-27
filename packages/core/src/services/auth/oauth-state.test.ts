import { SignJWT } from "jose";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceUnavailableError, ValidationError } from "../../http/errors";
import { signPurposeToken } from "../../http/tokens";
import {
  clearOAuthStateCookie,
  createOAuthState,
  readOAuthStateCookie,
  verifyOAuthState,
} from "./oauth-state";

const SECRET = "oauth-state-test-secret-that-is-at-least-32-characters";
const APP_URL = "https://devmentor.example";

afterEach(() => vi.unstubAllEnvs());

function configure(): void {
  vi.stubEnv("JWT_SECRET", SECRET);
  vi.stubEnv("APP_URL", APP_URL);
  vi.stubEnv("NODE_ENV", "test");
}

describe("OAuth state", () => {
  it("issues a nonce and signed, path-scoped cookie with a sanitized return path", async () => {
    configure();
    const issued = await createOAuthState("/mentor/home?tab=upcoming");
    expect(issued.state).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(issued.cookie).toContain("devmentor_oauth_state=");
    expect(issued.cookie).toContain("HttpOnly");
    expect(issued.cookie).toContain("SameSite=Lax");
    expect(issued.cookie).toContain("Path=/api/auth");
    expect(issued.cookie).toContain("Max-Age=600");
    expect(issued.cookie).not.toContain("Secure");

    const token = readOAuthStateCookie(issued.cookie);
    await expect(verifyOAuthState(issued.state, token)).resolves.toEqual({
      nonce: issued.state,
      returnTo: "/mentor/home?tab=upcoming",
    });
  });

  it("uses a Secure cookie in production unless insecure HTTP is enabled", async () => {
    configure();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
    expect((await createOAuthState()).cookie).toContain("Secure");
    expect(clearOAuthStateCookie()).toContain("Secure");

    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    vi.stubEnv("APP_URL", "http://127.0.0.1:3000");
    expect((await createOAuthState()).cookie).not.toContain("Secure");
    expect(clearOAuthStateCookie()).not.toContain("Secure");
  });

  it("omits returnTo when one is not provided and requires APP_URL when one is provided", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const issued = await createOAuthState();
    await expect(verifyOAuthState(issued.state, readOAuthStateCookie(issued.cookie))).resolves.toEqual({
      nonce: issued.state,
    });

    vi.stubEnv("APP_URL", "");
    await expect(createOAuthState("/mentor/home")).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it("rejects unsafe return paths during state creation", async () => {
    configure();
    await expect(createOAuthState("//attacker.example/path")).rejects.toBeInstanceOf(ValidationError);
  });

  it("requires the JWT secret to issue state", async () => {
    vi.stubEnv("JWT_SECRET", "");
    await expect(createOAuthState()).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it("reads only the state cookie value and handles absent or empty cookies", () => {
    expect(readOAuthStateCookie(null)).toBeNull();
    expect(readOAuthStateCookie("theme=dark; other=value")).toBeNull();
    expect(readOAuthStateCookie("devmentor_oauth_state=; theme=dark")).toBeNull();
    expect(readOAuthStateCookie("theme=dark; devmentor_oauth_state=signed-token; other=value")).toBe("signed-token");
  });

  it("clears the state cookie with the same path and an expired max age", () => {
    configure();
    expect(clearOAuthStateCookie()).toBe("devmentor_oauth_state=; HttpOnly; SameSite=Lax; Path=/api/auth; Max-Age=0");
  });

  it("returns null when the query state or cookie token is missing", async () => {
    expect(await verifyOAuthState(null, "signed-token")).toBeNull();
    expect(await verifyOAuthState("state", null)).toBeNull();
    expect(await verifyOAuthState("state", "")).toBeNull();
  });

  it("rejects mismatched, malformed, wrongly purposed, and expired state tokens", async () => {
    configure();
    const issued = await createOAuthState();
    const token = readOAuthStateCookie(issued.cookie);
    expect(await verifyOAuthState(`${issued.state}x`, token)).toBeNull();
    expect(await verifyOAuthState(issued.state, "not-a-token")).toBeNull();

    const otherPurpose = await signPurposeToken("register", { nonce: issued.state }, 600);
    expect(await verifyOAuthState(issued.state, otherPurpose)).toBeNull();

    const expired = await new SignJWT({ purpose: "oauth-state", nonce: issued.state })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(1)
      .sign(new TextEncoder().encode(SECRET));
    expect(await verifyOAuthState(issued.state, expired)).toBeNull();
  });

  it("rejects malformed signed claims and invalid signed return paths", async () => {
    configure();
    const noNonce = await signPurposeToken("oauth-state", { returnTo: "/mentor/home" }, 600);
    expect(await verifyOAuthState("nonce", noNonce)).toBeNull();

    const numericReturnTo = await signPurposeToken("oauth-state", { nonce: "nonce", returnTo: 2 }, 600);
    expect(await verifyOAuthState("nonce", numericReturnTo)).toBeNull();

    const unsafeReturnTo = await signPurposeToken("oauth-state", { nonce: "nonce", returnTo: "//attacker.example" }, 600);
    expect(await verifyOAuthState("nonce", unsafeReturnTo)).toBeNull();

    const absoluteReturnTo = await signPurposeToken(
      "oauth-state",
      { nonce: "nonce", returnTo: "https://devmentor.example/mentor/home" },
      600,
    );
    expect(await verifyOAuthState("nonce", absoluteReturnTo)).toBeNull();
  });

  it("propagates unavailable configuration after a valid signed state", async () => {
    configure();
    const issued = await createOAuthState("/mentor/home");
    vi.stubEnv("APP_URL", "");
    await expect(verifyOAuthState(issued.state, readOAuthStateCookie(issued.cookie))).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it("propagates a missing JWT secret rather than treating service configuration as a state mismatch", async () => {
    configure();
    const issued = await createOAuthState();
    vi.stubEnv("JWT_SECRET", "");
    await expect(verifyOAuthState(issued.state, readOAuthStateCookie(issued.cookie))).rejects.toBeInstanceOf(ServiceUnavailableError);
  });
});
