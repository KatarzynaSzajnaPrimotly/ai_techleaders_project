import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.LOG_LEVEL = "silent";
});

const mocks = vi.hoisted(() => ({
  githubIdentity: {
    createAuthorizationUrl: vi.fn(),
    exchangeCode: vi.fn(),
    getUser: vi.fn(),
    getEmails: vi.fn(),
  },
  accountService: { findOrCreateFromGithub: vi.fn() },
}));

vi.mock("../../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run(mocks),
}));

import { ServiceUnavailableError, ValidationError } from "@devmentor/core";
import { dynamic, GET } from "./route";

const APP_URL = "https://devmentor.example";
const JWT_SECRET = "github-start-test-secret-at-least-32-characters";

beforeEach(() => {
  mocks.githubIdentity.createAuthorizationUrl.mockReset().mockReturnValue("https://github.example/authorize?state=test");
  mocks.githubIdentity.exchangeCode.mockReset();
  mocks.githubIdentity.getUser.mockReset();
  mocks.githubIdentity.getEmails.mockReset();
  mocks.accountService.findOrCreateFromGithub.mockReset();
  vi.stubEnv("APP_URL", APP_URL);
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
  vi.stubEnv("GITHUB_CLIENT_SECRET", "client-secret");
});

afterEach(() => vi.unstubAllEnvs());

describe("GET /api/auth/github", () => {
  it("is rendered on demand", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("exports only the GET route handler", async () => {
    const route = await import("./route");
    expect(Object.keys(route).filter((key) => ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key))).toEqual(["GET"]);
  });

  it("redirects to GitHub with a signed state cookie and absolute callback URL", async () => {
    const response = await GET(new Request("http://localhost/api/auth/github?returnTo=%2Fmentor%2Fhome"), undefined);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://github.example/authorize?state=test");
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("devmentor_oauth_state=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Path=/api/auth");
    expect(cookie).toContain("Max-Age=600");
    expect(mocks.githubIdentity.createAuthorizationUrl).toHaveBeenCalledWith(expect.any(String), `${APP_URL}/api/auth/github/callback`);
  });

  it("maps an invalid returnTo to the state error without redirecting to it", async () => {
    const response = await GET(new Request("http://localhost/api/auth/github?returnTo=https%3A%2F%2Fevil.example"), undefined);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/sign-in?error=state");
    expect(response.headers.get("location")).not.toContain("evil.example");
    expect(mocks.githubIdentity.createAuthorizationUrl).not.toHaveBeenCalled();
  });

  it.each([
    ["configuration unavailable", new ServiceUnavailableError("Required configuration is missing: GITHUB_CLIENT_ID"), "/sign-in?error=unavailable"],
    ["invalid state input", new ValidationError("Invalid returnTo"), "/sign-in?error=state"],
  ])("maps typed %s errors through navigation", async (_name, error, location) => {
    if (error instanceof ServiceUnavailableError) mocks.githubIdentity.createAuthorizationUrl.mockImplementation(() => { throw error; });
    else mocks.githubIdentity.createAuthorizationUrl.mockImplementation(() => { throw error; });

    const response = await GET(new Request("http://localhost/api/auth/github"), undefined);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(location);
  });
});
