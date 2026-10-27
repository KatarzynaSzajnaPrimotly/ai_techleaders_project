import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "../logger";
import { absoluteUrl } from "./absolute-url";

afterEach(() => vi.unstubAllEnvs());

describe("absoluteUrl", () => {
  it("builds a URL on the configured origin", () => {
    vi.stubEnv("APP_URL", "https://devmentor.example");
    vi.stubEnv("NODE_ENV", "development");
    expect(absoluteUrl("/api/auth/callback")).toBe("https://devmentor.example/api/auth/callback");
  });

  it("requires APP_URL and rejects malformed values", () => {
    vi.stubEnv("APP_URL", "");
    expect(() => absoluteUrl("/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "Required configuration is missing: APP_URL" }),
    );
    vi.stubEnv("APP_URL", "not a URL");
    expect(() => absoluteUrl("/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "Required configuration is invalid: APP_URL" }),
    );
  });

  it("rejects unsupported URL schemes", () => {
    vi.stubEnv("APP_URL", "ftp://devmentor.example");
    expect(() => absoluteUrl("/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "Required configuration is invalid: APP_URL" }),
    );
    vi.stubEnv("APP_URL", "https://user:secret@devmentor.example");
    expect(() => absoluteUrl("/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "Required configuration is invalid: APP_URL" }),
    );
  });

  it("requires HTTPS in production unless the explicit insecure HTTP switch is on", () => {
    vi.stubEnv("APP_URL", "http://devmentor.example");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
    expect(() => absoluteUrl("/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "APP_URL must use HTTPS in production" }),
    );
    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    expect(absoluteUrl("/callback")).toBe("http://devmentor.example/callback");
  });

  it("logs if the insecure test flag is set for an HTTPS app URL", () => {
    vi.stubEnv("APP_URL", "https://devmentor.example");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_INSECURE_HTTP", "true");
    const error = vi.spyOn(logger, "error");
    expect(absoluteUrl("/callback")).toBe("https://devmentor.example/callback");
    expect(error).toHaveBeenCalledWith("ALLOW_INSECURE_HTTP must not be set when APP_URL uses HTTPS");
  });

  it("rejects absolute and protocol-relative destinations on other origins", () => {
    vi.stubEnv("APP_URL", "https://devmentor.example");
    expect(() => absoluteUrl("https://attacker.example/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503 }),
    );
    expect(() => absoluteUrl("//attacker.example/callback")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503 }),
    );
  });

  it("rejects malformed path values", () => {
    vi.stubEnv("APP_URL", "https://devmentor.example");
    expect(() => absoluteUrl("http://[invalid")).toThrowError(
      expect.objectContaining({ code: "SERVICE_UNAVAILABLE", status: 503, message: "The application URL path is invalid" }),
    );
  });
});
