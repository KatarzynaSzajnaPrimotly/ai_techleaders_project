import { ServiceUnavailableError } from "../http/errors";
import { requireConfig } from "./env";

const DEFAULT_OAUTH_BASE_URL = "https://github.com";
const DEFAULT_API_BASE_URL = "https://api.github.com";
const HTTP_PROTOCOL = "http:";
const HTTPS_PROTOCOL = "https:";

export interface GithubConfig {
  clientId: string;
  clientSecret: string;
  oauthBaseUrl: string;
  apiBaseUrl: string;
}

function parseBaseUrl(value: string, variable: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new ServiceUnavailableError(`Required configuration is invalid: ${variable}`);
  }

  if ((parsed.protocol !== HTTP_PROTOCOL && parsed.protocol !== HTTPS_PROTOCOL) || parsed.username || parsed.password ||
    parsed.search || parsed.hash) {
    throw new ServiceUnavailableError(`Required configuration is invalid: ${variable}`);
  }

  return parsed.toString().replace(/\/$/u, "");
}

export function getGithubConfig(): GithubConfig {
  const credentials = requireConfig(["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]);
  return {
    clientId: credentials.GITHUB_CLIENT_ID.trim(),
    clientSecret: credentials.GITHUB_CLIENT_SECRET.trim(),
    oauthBaseUrl: parseBaseUrl(
      process.env.GITHUB_OAUTH_BASE_URL?.trim() || DEFAULT_OAUTH_BASE_URL,
      "GITHUB_OAUTH_BASE_URL",
    ),
    apiBaseUrl: parseBaseUrl(
      process.env.GITHUB_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL,
      "GITHUB_API_BASE_URL",
    ),
  };
}
