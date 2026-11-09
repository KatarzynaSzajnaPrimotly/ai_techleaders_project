import { describe, expect, it } from "vitest";
import { hashToken, mintOpaqueToken } from "./token.service";

describe("invitation token service", () => {
  it("mints a 32-byte token in URL-safe encoding", () => {
    const token = mintOpaqueToken();

    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(Buffer.from(token, "base64url")).toHaveLength(32);
  });

  it("mints distinct tokens", () => {
    expect(mintOpaqueToken()).not.toBe(mintOpaqueToken());
  });

  it("hashes a token deterministically to a SHA-256 hex digest", () => {
    const token = "invitation-token";

    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).toBe("b52f5b0cd4dd05f04794b4fcffbc63c59d5782318409ba6efb9366d21ab4a6df");
  });
});
