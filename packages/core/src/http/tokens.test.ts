import { SignJWT } from "jose";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requireJwtSecret } from "../config/env";
import { signSession, verifySession } from "./auth";
import { ValidationError } from "./errors";
import { signPurposeToken, verifyPurposeToken } from "./tokens";

const SECRET = "a-purpose-token-test-secret-at-least-32-characters";

afterEach(() => vi.unstubAllEnvs());

describe("purpose tokens", () => {
  it("signs and verifies claims for their intended purpose", async () => {
    const token = await signPurposeToken("oauth-state", { nonce: "n-1" }, 600, SECRET);
    await expect(verifyPurposeToken(token, "oauth-state", SECRET)).resolves.toMatchObject({
      purpose: "oauth-state",
      nonce: "n-1",
    });
  });

  it("rejects a different expected purpose", async () => {
    const token = await signPurposeToken("oauth-state", { nonce: "n-1" }, 600, SECRET);
    await expect(verifyPurposeToken(token, "register", SECRET)).rejects.toMatchObject({
      name: "UnauthorizedError",
      status: 401,
      message: "Invalid or expired token",
    });
  });

  it("rejects a purpose token as a session and a session as a purpose token", async () => {
    const purposeToken = await signPurposeToken("oauth-state", { nonce: "n-1" }, 600, SECRET);
    const sessionToken = await signSession({ userId: "u-1", role: "mentee", sessionVersion: 0 }, SECRET);
    await expect(verifySession(purposeToken, SECRET)).rejects.toMatchObject({ status: 401 });
    await expect(verifyPurposeToken(sessionToken, "oauth-state", SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("rejects tampered, expired and incorrectly signed tokens", async () => {
    const token = await signPurposeToken("register", { email: "ada@example.test" }, 600, SECRET);
    const [header, payload, signature] = token.split(".");
    const tampered = `${header}.${Buffer.from(JSON.stringify({ purpose: "register", email: "grace@example.test" })).toString("base64url")}.${signature}`;
    const expired = await new SignJWT({ purpose: "register" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(1)
      .sign(new TextEncoder().encode(SECRET));
    await expect(verifyPurposeToken(tampered, "register", SECRET)).rejects.toMatchObject({ status: 401 });
    await expect(verifyPurposeToken(expired, "register", SECRET)).rejects.toMatchObject({ status: 401 });
    await expect(verifyPurposeToken(token, "register", "x".repeat(SECRET.length))).rejects.toMatchObject({ status: 401 });
    expect(payload).toBeDefined();
  });

  it("rejects missing secrets and falls back to JWT_SECRET", async () => {
    vi.stubEnv("JWT_SECRET", "");
    expect(() => requireJwtSecret()).toThrowError(expect.objectContaining({ status: 503 }));
    await expect(signPurposeToken("register", {}, 60)).rejects.toMatchObject({ status: 503 });
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signPurposeToken("register", { email: "ada@example.test" }, 60);
    await expect(verifyPurposeToken(token, "register")).resolves.toMatchObject({ email: "ada@example.test" });
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])("rejects an invalid lifetime (%s)", async (ttl) => {
    await expect(signPurposeToken("register", {}, ttl, SECRET)).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects an empty purpose and overwrites a caller-supplied purpose claim", async () => {
    await expect(signPurposeToken("   ", {}, 60, SECRET)).rejects.toBeInstanceOf(ValidationError);
    const token = await signPurposeToken("register", { purpose: "oauth-state" }, 60, SECRET);
    await expect(verifyPurposeToken(token, "register", SECRET)).resolves.toMatchObject({ purpose: "register" });
    await expect(verifyPurposeToken(token, "   ", SECRET)).rejects.toMatchObject({ status: 401 });
  });

  it("rejects a token whose protected header uses the wrong algorithm", async () => {
    const token = await new SignJWT({ purpose: "register" })
      .setProtectedHeader({ alg: "HS384" })
      .setIssuedAt()
      .setExpirationTime("60s")
      .sign(new TextEncoder().encode(SECRET));
    await expect(verifyPurposeToken(token, "register", SECRET)).rejects.toMatchObject({ status: 401 });
  });
});
