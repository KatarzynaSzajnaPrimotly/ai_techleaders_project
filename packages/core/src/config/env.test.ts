import { afterEach, describe, expect, it, vi } from "vitest";
import { parseEnv, requireJwtSecret } from "./env";

afterEach(() => {
  vi.unstubAllEnvs();
});

const SECRET = "a".repeat(32);

describe("parseEnv", () => {
  it("applies defaults", () => {
    expect(parseEnv({})).toEqual({ NODE_ENV: "development", LOG_LEVEL: "info" });
  });

  it("reads validated values", () => {
    expect(parseEnv({ NODE_ENV: "production", LOG_LEVEL: "warn", JWT_SECRET: SECRET })).toEqual({
      NODE_ENV: "production",
      LOG_LEVEL: "warn",
      JWT_SECRET: SECRET,
    });
  });

  it("rejects invalid values, naming the variables but never their values", () => {
    expect(() => parseEnv({ LOG_LEVEL: "loud", JWT_SECRET: "short" })).toThrowError(
      "Invalid environment variables: LOG_LEVEL, JWT_SECRET",
    );
    expect(() => parseEnv({ JWT_SECRET: "short" })).not.toThrowError(/short/);
  });

  it("reads process.env by default", () => {
    vi.stubEnv("LOG_LEVEL", "debug");
    expect(parseEnv().LOG_LEVEL).toBe("debug");
  });
});

describe("requireJwtSecret", () => {
  it("returns the secret from the given env", () => {
    expect(requireJwtSecret(parseEnv({ JWT_SECRET: SECRET }))).toBe(SECRET);
  });

  it("throws when the secret is missing", () => {
    expect(() => requireJwtSecret(parseEnv({}))).toThrowError("JWT_SECRET is not set");
  });

  it("falls back to process.env", () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    expect(requireJwtSecret()).toBe(SECRET);
  });
});
