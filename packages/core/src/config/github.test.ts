import { afterEach, describe, expect, it, vi } from "vitest";
import { getGithubConfig } from "./github";

afterEach(() => vi.unstubAllEnvs());

describe("getGithubConfig", () => {
  it("requires non-empty client credentials and supplies GitHub's production base URLs", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", " client-id ");
    vi.stubEnv("GITHUB_CLIENT_SECRET", " client-secret ");
    expect(getGithubConfig()).toEqual({
      clientId: "client-id",
      clientSecret: "client-secret",
      oauthBaseUrl: "https://github.com",
      apiBaseUrl: "https://api.github.com",
    });
  });

  it("uses configured local fake service URLs", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "client-secret");
    vi.stubEnv("GITHUB_OAUTH_BASE_URL", " http://127.0.0.1:4000/ ");
    vi.stubEnv("GITHUB_API_BASE_URL", " http://127.0.0.1:4000/ ");
    expect(getGithubConfig()).toMatchObject({
      oauthBaseUrl: "http://127.0.0.1:4000",
      apiBaseUrl: "http://127.0.0.1:4000",
    });
  });

  it.each([
    ["GITHUB_OAUTH_BASE_URL", "not a URL"],
    ["GITHUB_OAUTH_BASE_URL", "ftp://github.example"],
    ["GITHUB_OAUTH_BASE_URL", "https://user:secret@github.example"],
    ["GITHUB_API_BASE_URL", "https://api.github.example?token=secret"],
    ["GITHUB_API_BASE_URL", "https://api.github.example/#fragment"],
  ])("rejects invalid %s without returning configured values", (variable, value) => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "client-secret");
    vi.stubEnv(variable, value);
    expect(() => getGithubConfig()).toThrowError(expect.objectContaining({
      code: "SERVICE_UNAVAILABLE",
      status: 503,
      message: `Required configuration is invalid: ${variable}`,
    }));
  });

  it("fails lazily and never includes partial credential values in the error", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "");
    expect(() => getGithubConfig()).toThrowError(expect.objectContaining({
      code: "SERVICE_UNAVAILABLE",
      message: "Required configuration is missing: GITHUB_CLIENT_SECRET",
    }));
  });
});
