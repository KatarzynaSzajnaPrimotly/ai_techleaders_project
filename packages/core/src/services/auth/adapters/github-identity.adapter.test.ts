import { afterEach, describe, expect, it, vi } from "vitest";
import { getGithubConfig } from "../../../config/github";
import { ServiceUnavailableError, ValidationError } from "../../../http/errors";
import type { GithubConfig } from "../../../config/github";
import { createGithubIdentityAdapter } from "./github-identity.adapter";

const CONFIG: GithubConfig = {
  clientId: "client-id",
  clientSecret: "client-secret",
  oauthBaseUrl: "https://github.example",
  apiBaseUrl: "https://api.github.example",
};
const USER = { id: 123, login: "ada", name: "Ada Lovelace", avatar_url: "https://example.test/ada.png" };
const EMAILS = [{ email: "ada@example.test", primary: true, verified: true, visibility: "private" }];

afterEach(() => vi.unstubAllEnvs());

function createFetcher(...responses: Response[]): typeof fetch {
  const fetcher = vi.fn<typeof fetch>();
  for (const response of responses) fetcher.mockResolvedValueOnce(response);
  return fetcher;
}

const response = (body: unknown, status = 200) => Response.json(body, { status });

describe("GitHub identity adapter", () => {
  it("builds an authorization URL with the requested scope and callback", () => {
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher() });
    const url = new URL(adapter.createAuthorizationUrl("nonce value", "https://devmentor.example/callback"));
    expect(url.origin).toBe(CONFIG.oauthBaseUrl);
    expect(url.pathname).toBe("/login/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("client-id");
    expect(url.searchParams.get("redirect_uri")).toBe("https://devmentor.example/callback");
    expect(url.searchParams.get("scope")).toBe("user:email");
    expect(url.searchParams.get("state")).toBe("nonce value");
  });

  it.each([["", "callback"], ["state", ""]])("rejects missing authorization URL values", (state, redirectUri) => {
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher() });
    expect(() => adapter.createAuthorizationUrl(state, redirectUri)).toThrowError(ValidationError);
  });

  it("exchanges a code using the configured confidential client and callback URL", async () => {
    const fetcher = createFetcher(response({ access_token: "access-token", token_type: "bearer" }));
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher });
    await expect(adapter.exchangeCode("auth-code", "https://devmentor.example/callback")).resolves.toBe("access-token");
    expect(fetcher).toHaveBeenCalledWith(`${CONFIG.oauthBaseUrl}/login/oauth/access_token`, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify({
        client_id: CONFIG.clientId,
        client_secret: CONFIG.clientSecret,
        code: "auth-code",
        redirect_uri: "https://devmentor.example/callback",
      }),
    });
  });

  it.each([["", "https://devmentor.example/callback"], ["auth-code", ""]])(
    "rejects missing code exchange values",
    async (code, redirectUri) => {
      const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher() });
      await expect(adapter.exchangeCode(code, redirectUri)).rejects.toBeInstanceOf(ValidationError);
    },
  );

  it("maps an unsuccessful token response and malformed response bodies to a generic unavailable error", async () => {
    const rejected = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(response({ error: "secret details" }, 401)) });
    await expect(rejected.exchangeCode("code", "https://devmentor.example/callback")).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      message: "GitHub authentication is temporarily unavailable",
    });

    const malformedJson = new Response("{", { status: 200, headers: { "content-type": "application/json" } });
    const malformed = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(malformedJson) });
    await expect(malformed.exchangeCode("code", "https://devmentor.example/callback")).rejects.toBeInstanceOf(ServiceUnavailableError);

    const network = vi.fn<typeof fetch>().mockRejectedValue(new Error("contains network detail"));
    const networkFailure = createGithubIdentityAdapter({ config: CONFIG, fetcher: network });
    await expect(networkFailure.exchangeCode("code", "https://devmentor.example/callback")).rejects.toMatchObject({
      message: "GitHub authentication is temporarily unavailable",
    });
  });

  it.each([null, {}, { access_token: "" }, { access_token: 42 }])(
    "rejects an invalid token response (%s)",
    async (body) => {
      const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(response(body)) });
      await expect(adapter.exchangeCode("code", "https://devmentor.example/callback")).rejects.toBeInstanceOf(ServiceUnavailableError);
    },
  );

  it("maps the GitHub profile and requests it with the bearer token", async () => {
    const fetcher = createFetcher(response(USER));
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher });
    await expect(adapter.getUser("access-token")).resolves.toEqual({
      id: "123",
      login: "ada",
      name: "Ada Lovelace",
      avatarUrl: "https://example.test/ada.png",
    });
    expect(fetcher).toHaveBeenCalledWith(`${CONFIG.apiBaseUrl}/user`, {
      headers: {
        accept: "application/vnd.github+json",
        authorization: "Bearer access-token",
        "x-github-api-version": "2022-11-28",
      },
    });
  });

  it("rejects a missing user access token", async () => {
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher() });
    await expect(adapter.getUser("")).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps profile HTTP, network, and JSON failures to a generic unavailable error", async () => {
    const httpFailure = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(response({}, 500)) });
    await expect(httpFailure.getUser("token")).rejects.toBeInstanceOf(ServiceUnavailableError);

    const network = vi.fn<typeof fetch>().mockRejectedValue(new Error("contains network detail"));
    const networkFailure = createGithubIdentityAdapter({ config: CONFIG, fetcher: network });
    await expect(networkFailure.getUser("token")).rejects.toMatchObject({
      message: "GitHub authentication is temporarily unavailable",
    });

    const malformedJson = new Response("{", { status: 200, headers: { "content-type": "application/json" } });
    const malformed = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(malformedJson) });
    await expect(malformed.getUser("token")).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it.each([
    null,
    {},
    { ...USER, id: "123" },
    { ...USER, id: Number.MAX_SAFE_INTEGER + 1 },
    { ...USER, id: -1 },
    { ...USER, login: 1 },
    { ...USER, login: "" },
    { ...USER, name: 1 },
    { ...USER, avatar_url: 1 },
  ])("rejects an invalid GitHub profile (%s)", async (body) => {
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(response(body)) });
    await expect(adapter.getUser("token")).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it("returns all e-mail records with primary and verified flags intact", async () => {
    const fetcher = createFetcher(response(EMAILS));
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher });
    await expect(adapter.getEmails("access-token")).resolves.toEqual(EMAILS);
    expect(fetcher).toHaveBeenCalledWith(`${CONFIG.apiBaseUrl}/user/emails`, {
      headers: {
        accept: "application/vnd.github+json",
        authorization: "Bearer access-token",
        "x-github-api-version": "2022-11-28",
      },
    });
  });

  it("rejects a missing email lookup token", async () => {
    const adapter = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher() });
    await expect(adapter.getEmails("")).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps email HTTP, network, malformed JSON, and invalid shapes to safe errors", async () => {
    const httpFailure = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(response({}, 500)) });
    await expect(httpFailure.getEmails("token")).rejects.toBeInstanceOf(ServiceUnavailableError);

    const network = vi.fn<typeof fetch>().mockRejectedValue(new Error("contains network detail"));
    const networkFailure = createGithubIdentityAdapter({ config: CONFIG, fetcher: network });
    await expect(networkFailure.getEmails("token")).rejects.toMatchObject({
      message: "GitHub authentication is temporarily unavailable",
    });

    const malformedJson = new Response("{", { status: 200, headers: { "content-type": "application/json" } });
    const malformed = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(malformedJson) });
    await expect(malformed.getEmails("token")).rejects.toBeInstanceOf(ServiceUnavailableError);

    for (const body of [null, {}, [null], [{ ...EMAILS[0], email: 2 }], [{ ...EMAILS[0], primary: 2 }],
      [{ ...EMAILS[0], verified: 2 }], [{ ...EMAILS[0], visibility: "secret" }]]) {
      const invalid = createGithubIdentityAdapter({ config: CONFIG, fetcher: createFetcher(response(body)) });
      await expect(invalid.getEmails("token")).rejects.toBeInstanceOf(ServiceUnavailableError);
    }
  });

  it("loads config lazily only when no config is injected", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-id");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "client-secret");
    const adapter = createGithubIdentityAdapter();
    expect(adapter).toBeDefined();
    expect(getGithubConfig().clientId).toBe("client-id");
  });
});
