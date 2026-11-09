import { getGithubConfig, type GithubConfig } from "../../../config/github";
import { ServiceUnavailableError, ValidationError } from "../../../http/errors";
import type { GithubEmail, GithubIdentityPort, GithubUser } from "../github-identity.port";

const AUTHORIZE_PATH = "/login/oauth/authorize";
const TOKEN_PATH = "/login/oauth/access_token";
const USER_PATH = "/user";
const EMAILS_PATH = "/user/emails";
const GITHUB_EMAIL_SCOPE = "user:email";
const GITHUB_API_VERSION = "2022-11-28";
const JSON_ACCEPT = "application/json";
const GITHUB_JSON_ACCEPT = "application/vnd.github+json";
const TEMPORARY_GITHUB_ERROR = "GitHub authentication is temporarily unavailable";

export interface GithubAdapterDependencies {
  config?: GithubConfig;
  fetcher?: typeof fetch;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json() as unknown;
  } catch {
    throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
  }
}

function parseAccessToken(value: unknown): string {
  if (!isRecord(value) || typeof value.access_token !== "string" || value.access_token.length === 0) {
    throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
  }
  return value.access_token;
}

function parseGithubUser(value: unknown): GithubUser {
  if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || value.id < 0 ||
    typeof value.login !== "string" || value.login.length === 0 ||
    (typeof value.name !== "string" && value.name !== null) ||
    (typeof value.avatar_url !== "string" && value.avatar_url !== null)) {
    throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
  }
  return {
    id: String(value.id),
    login: value.login,
    name: value.name,
    avatarUrl: value.avatar_url,
  };
}

function parseGithubEmails(value: unknown): GithubEmail[] {
  if (!Array.isArray(value)) throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
  return value.map((item): GithubEmail => {
    if (!isRecord(item) || typeof item.email !== "string" || typeof item.primary !== "boolean" ||
      typeof item.verified !== "boolean" ||
      (item.visibility !== "public" && item.visibility !== "private" && item.visibility !== null)) {
      throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
    }
    return {
      email: item.email,
      primary: item.primary,
      verified: item.verified,
      visibility: item.visibility,
    };
  });
}

function endpoint(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

export function createGithubIdentityAdapter(dependencies: GithubAdapterDependencies = {}): GithubIdentityPort {
  const config = dependencies.config ?? getGithubConfig();
  const fetcher = dependencies.fetcher ?? fetch;

  return {
    createAuthorizationUrl(state, redirectUri): string {
      if (!state || !redirectUri) throw new ValidationError("GitHub OAuth state and redirect URI are required");
      const url = new URL(AUTHORIZE_PATH, config.oauthBaseUrl);
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("scope", GITHUB_EMAIL_SCOPE);
      url.searchParams.set("state", state);
      return url.toString();
    },

    async exchangeCode(code, redirectUri): Promise<string> {
      if (!code || !redirectUri) throw new ValidationError("GitHub authorization code and redirect URI are required");
      let response: Response;
      try {
        response = await fetcher(endpoint(config.oauthBaseUrl, TOKEN_PATH), {
          method: "POST",
          headers: { accept: JSON_ACCEPT, "content-type": "application/json" },
          body: JSON.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri: redirectUri,
          }),
        });
      } catch {
        throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
      }
      if (!response.ok) throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
      return parseAccessToken(await readJson(response));
    },

    async getUser(accessToken): Promise<GithubUser> {
      if (!accessToken) throw new ValidationError("GitHub access token is required");
      let response: Response;
      try {
        response = await fetcher(endpoint(config.apiBaseUrl, USER_PATH), {
          headers: {
            accept: GITHUB_JSON_ACCEPT,
            authorization: `Bearer ${accessToken}`,
            "x-github-api-version": GITHUB_API_VERSION,
          },
        });
      } catch {
        throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
      }
      if (!response.ok) throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
      return parseGithubUser(await readJson(response));
    },

    async getEmails(accessToken): Promise<GithubEmail[]> {
      if (!accessToken) throw new ValidationError("GitHub access token is required");
      let response: Response;
      try {
        response = await fetcher(endpoint(config.apiBaseUrl, EMAILS_PATH), {
          headers: {
            accept: GITHUB_JSON_ACCEPT,
            authorization: `Bearer ${accessToken}`,
            "x-github-api-version": GITHUB_API_VERSION,
          },
        });
      } catch {
        throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
      }
      if (!response.ok) throw new ServiceUnavailableError(TEMPORARY_GITHUB_ERROR);
      return parseGithubEmails(await readJson(response));
    },
  };
}
