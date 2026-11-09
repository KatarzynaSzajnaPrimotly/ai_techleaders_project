import { afterEach, describe, expect, it, vi } from "vitest";
import { isInsecureHttpAllowed, parseEnv, requireConfig, requireJwtSecret } from "./env";
import { logger } from "../logger";

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
    vi.stubEnv("JWT_SECRET", SECRET);
    expect(requireJwtSecret()).toBe(SECRET);
  });

  it("throws when the secret is missing", () => {
    vi.stubEnv("JWT_SECRET", "");
    expect(() => requireJwtSecret()).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "Required configuration is missing: JWT_SECRET" }),
    );
  });

  it("rejects a secret that is present but shorter than the minimum", () => {
    vi.stubEnv("JWT_SECRET", "too-short");
    expect(() => requireJwtSecret()).toThrowError(
      expect.objectContaining({
        code: "SERVICE_UNAVAILABLE",
        status: 503,
        message: "Required configuration is invalid: JWT_SECRET",
      }),
    );
  });

  it("falls back to process.env", () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    expect(requireJwtSecret()).toBe(SECRET);
  });
});

describe("requireConfig", () => {
  it("returns the requested process environment values", () => {
    vi.stubEnv("APP_URL", "https://devmentor.example");
    vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
    expect(requireConfig(["APP_URL", "GITHUB_CLIENT_ID"])).toEqual({
      APP_URL: "https://devmentor.example",
      GITHUB_CLIENT_ID: "client-id",
    });
  });

  it("lists only missing variable names and treats empty values as missing", () => {
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
    try {
      requireConfig(["APP_URL", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]);
      throw new Error("Expected missing configuration to fail");
    } catch (error) {
      expect(error).toMatchObject({
        code: "SERVICE_UNAVAILABLE",
        status: 503,
        message: "Required configuration is missing: APP_URL, GITHUB_CLIENT_SECRET",
      });
      expect((error as Error).message).not.toContain("client-id");
    }
  });
});

describe("isInsecureHttpAllowed", () => {
  it("is false unless the explicit test-only flag is true", () => {
    expect(isInsecureHttpAllowed()).toBe(false);
    vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
    expect(isInsecureHttpAllowed()).toBe(false);
    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    expect(isInsecureHttpAllowed()).toBe(true);
  });

  it("logs an error when enabled alongside an HTTPS app URL", () => {
    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    vi.stubEnv("APP_URL", "https://devmentor.example");
    const error = vi.spyOn(logger, "error");
    expect(isInsecureHttpAllowed()).toBe(true);
    expect(error).toHaveBeenCalledWith("ALLOW_INSECURE_HTTP must not be set when APP_URL uses HTTPS");
  });

  it("does not log for an HTTP app URL or an unset app URL", () => {
    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    const error = vi.spyOn(logger, "error");
    vi.stubEnv("APP_URL", "http://localhost:3000");
    expect(isInsecureHttpAllowed()).toBe(true);
    delete process.env.APP_URL;
    expect(isInsecureHttpAllowed()).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });
});
