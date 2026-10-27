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

vi.mock("../../../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run(mocks),
}));

import {
  ConflictError,
  createOAuthState,
  NoVerifiedGithubEmailError,
  ServiceUnavailableError,
  verifySession,
  type User,
} from "@devmentor/core";
import { dynamic, GET } from "./route";

const APP_URL = "https://devmentor.example";
const JWT_SECRET = "github-callback-test-secret-at-least-32-characters";
const user: User = {
  id: "user-1",
  email: "ada@example.test",
  emailVerifiedAt: new Date("2026-10-27T00:00:00.000Z"),
  passwordHash: null,
  displayName: "Ada",
  role: "mentor",
  githubId: "123",
  githubLogin: "ada",
  avatarUrl: null,
  createdAt: new Date("2026-10-27T00:00:00.000Z"),
  updatedAt: new Date("2026-10-27T00:00:00.000Z"),
};

beforeEach(() => {
  mocks.githubIdentity.exchangeCode.mockReset().mockResolvedValue("github-access-token");
  mocks.accountService.findOrCreateFromGithub.mockReset().mockResolvedValue(user);
  vi.stubEnv("APP_URL", APP_URL);
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
});

afterEach(() => vi.unstubAllEnvs());

function callbackRequest(search: string, cookie?: string): Request {
  return new Request(`http://localhost/api/auth/github/callback${search}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

function cookieValue(cookie: string): string {
  return cookie.split(";", 1)[0] ?? "";
}

function getCookies(response: Response): string[] {
  return response.headers.getSetCookie();
}

describe("GET /api/auth/github/callback", () => {
  it("is rendered on demand", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("exports only the GET route handler", async () => {
    const route = await import("./route");
    expect(Object.keys(route).filter((key) => ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key))).toEqual(["GET"]);
  });

  it("redirects to the mentor home, clears OAuth state, and sets a valid session cookie", async () => {
    const issued = await createOAuthState();
    const query = new URLSearchParams({ code: "auth-code", state: issued.state });
    const response = await GET(callbackRequest(`?${query}`, cookieValue(issued.cookie)), undefined);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/mentor");
    expect(mocks.githubIdentity.exchangeCode).toHaveBeenCalledWith("auth-code", `${APP_URL}/api/auth/github/callback`);
    expect(mocks.accountService.findOrCreateFromGithub).toHaveBeenCalledWith("github-access-token");
    const cookies = getCookies(response);
    expect(cookies).toHaveLength(2);
    expect(cookies[0]).toContain("devmentor_oauth_state=; ");
    const sessionCookie = cookies.find((cookie) => cookie.startsWith("devmentor_session="));
    expect(sessionCookie).toBeDefined();
    const token = sessionCookie?.split(";", 1)[0]?.slice("devmentor_session=".length);
    await expect(verifySession(token ?? "", JWT_SECRET)).resolves.toEqual({ userId: user.id, role: user.role });
  });

  it("redirects to the signed, sanitized returnTo after successful sign-in", async () => {
    const issued = await createOAuthState("/mentor/home?tab=upcoming");
    const query = new URLSearchParams({ code: "auth-code", state: issued.state });
    const response = await GET(callbackRequest(`?${query}`, cookieValue(issued.cookie)), undefined);

    expect(response.headers.get("location")).toBe("/mentor/home?tab=upcoming");
  });

  it("cancels sign-in without requiring state and clears the OAuth cookie", async () => {
    const response = await GET(callbackRequest("?error=access_denied"), undefined);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/sign-in?cancelled=1");
    expect(getCookies(response)).toEqual([expect.stringContaining("devmentor_oauth_state=; ")]);
    expect(mocks.githubIdentity.exchangeCode).not.toHaveBeenCalled();
    expect(mocks.accountService.findOrCreateFromGithub).not.toHaveBeenCalled();
  });

  it("redirects missing state to the state error and clears the OAuth cookie", async () => {
    const response = await GET(callbackRequest("?code=auth-code"), undefined);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/sign-in?error=state");
    expect(getCookies(response)).toEqual([expect.stringContaining("devmentor_oauth_state=; ")]);
    expect(mocks.githubIdentity.exchangeCode).not.toHaveBeenCalled();
  });

  it("redirects a tampered state cookie to the state error", async () => {
    const issued = await createOAuthState();
    const [name, token] = cookieValue(issued.cookie).split("=");
    const last = token?.slice(-1) === "a" ? "b" : "a";
    const tampered = `${name}=${token?.slice(0, -1)}${last}`;
    const query = new URLSearchParams({ code: "auth-code", state: issued.state });
    const response = await GET(callbackRequest(`?${query}`, tampered), undefined);

    expect(response.headers.get("location")).toBe("/sign-in?error=state");
    expect(mocks.githubIdentity.exchangeCode).not.toHaveBeenCalled();
  });

  it("redirects to the no-verified-email message and does not issue a session", async () => {
    const issued = await createOAuthState();
    const query = new URLSearchParams({ code: "auth-code", state: issued.state });
    mocks.accountService.findOrCreateFromGithub.mockRejectedValue(new NoVerifiedGithubEmailError());

    const response = await GET(callbackRequest(`?${query}`, cookieValue(issued.cookie)), undefined);

    expect(response.headers.get("location")).toBe("/sign-in?error=no-verified-email");
    expect(getCookies(response)).toEqual([expect.stringContaining("devmentor_oauth_state=; ")]);
  });

  it("hides an e-mail account linked to another GitHub identity behind unavailable", async () => {
    const issued = await createOAuthState();
    const query = new URLSearchParams({ code: "auth-code", state: issued.state });
    mocks.accountService.findOrCreateFromGithub.mockRejectedValue(new ConflictError("This e-mail is already linked to another GitHub account"));

    const response = await GET(callbackRequest(`?${query}`, cookieValue(issued.cookie)), undefined);

    expect(response.headers.get("location")).toBe("/sign-in?error=unavailable");
    expect(getCookies(response)).toEqual([expect.stringContaining("devmentor_oauth_state=; ")]);
  });

  it("redirects an unknown provider error to unavailable", async () => {
    const response = await GET(callbackRequest("?error=server_error"), undefined);

    expect(response.headers.get("location")).toBe("/sign-in?error=unavailable");
  });

  it("maps missing GitHub configuration to unavailable and maps a missing code to state", async () => {
    const issued = await createOAuthState();
    vi.stubEnv("JWT_SECRET", "");
    const unavailable = await GET(callbackRequest("?code=auth-code&state=x", "devmentor_oauth_state=token"), undefined);
    expect(unavailable.headers.get("location")).toBe("/sign-in?error=unavailable");

    vi.stubEnv("JWT_SECRET", JWT_SECRET);
    const noCode = await GET(callbackRequest(`?state=${issued.state}`, cookieValue(issued.cookie)), undefined);
    expect(noCode.headers.get("location")).toBe("/sign-in?error=state");
  });

  it("maps GitHub transport failures to unavailable", async () => {
    const issued = await createOAuthState();
    const query = new URLSearchParams({ code: "auth-code", state: issued.state });
    mocks.githubIdentity.exchangeCode.mockRejectedValue(new ServiceUnavailableError());

    const response = await GET(callbackRequest(`?${query}`, cookieValue(issued.cookie)), undefined);

    expect(response.headers.get("location")).toBe("/sign-in?error=unavailable");
  });
});
