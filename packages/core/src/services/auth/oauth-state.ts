import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { JWTPayload } from "jose";
import { isInsecureHttpAllowed, requireConfig } from "../../config/env";
import { UnauthorizedError } from "../../http/errors";
import { signPurposeToken, verifyPurposeToken } from "../../http/tokens";
import { safeReturnTo } from "../../validators/auth/safe-return-to";

const OAUTH_STATE_PURPOSE = "oauth-state";
const OAUTH_STATE_TTL_SECONDS = 10 * 60;
const OAUTH_STATE_COOKIE_NAME = "devmentor_oauth_state";
const OAUTH_STATE_COOKIE_PATH = "/api/auth";
const OAUTH_NONCE_BYTES = 32;

export interface OAuthStateClaims extends JWTPayload {
  nonce: string;
  returnTo?: string;
}

export interface OAuthStateIssue {
  state: string;
  cookie: string;
}

function secureCookie(): boolean {
  return process.env.NODE_ENV === "production" && !isInsecureHttpAllowed();
}

function cookieAttributes(maxAgeSeconds: number): string[] {
  const attributes = ["HttpOnly", "SameSite=Lax", `Path=${OAUTH_STATE_COOKIE_PATH}`, `Max-Age=${maxAgeSeconds}`];
  if (secureCookie()) attributes.push("Secure");
  return attributes;
}

function nonceMatches(received: string, expected: string): boolean {
  const receivedHash = createHash("sha256").update(received).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(receivedHash, expectedHash);
}

export function readOAuthStateCookie(cookieHeader: string | null): string | null {
  const prefix = `${OAUTH_STATE_COOKIE_NAME}=`;
  const entry = cookieHeader?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  if (!entry) return null;
  const value = entry.slice(prefix.length);
  return value || null;
}

export function clearOAuthStateCookie(): string {
  return `${OAUTH_STATE_COOKIE_NAME}=; ${cookieAttributes(0).join("; ")}`;
}

export async function createOAuthState(returnTo?: string): Promise<OAuthStateIssue> {
  const nonce = randomBytes(OAUTH_NONCE_BYTES).toString("base64url");
  const claims: OAuthStateClaims = { nonce };
  if (returnTo !== undefined) {
    const { APP_URL } = requireConfig(["APP_URL"]);
    claims.returnTo = safeReturnTo(returnTo, APP_URL);
  }
  const token = await signPurposeToken(OAUTH_STATE_PURPOSE, claims, OAUTH_STATE_TTL_SECONDS);
  return {
    state: nonce,
    cookie: `${OAUTH_STATE_COOKIE_NAME}=${token}; ${cookieAttributes(OAUTH_STATE_TTL_SECONDS).join("; ")}`,
  };
}

export async function verifyOAuthState(
  receivedState: string | null | undefined,
  cookieToken: string | null | undefined,
): Promise<OAuthStateClaims | null> {
  if (!receivedState || !cookieToken) return null;

  let claims;
  try {
    claims = await verifyPurposeToken(cookieToken, OAUTH_STATE_PURPOSE);
  } catch (error) {
    if (error instanceof UnauthorizedError) return null;
    throw error;
  }

  if (typeof claims.nonce !== "string" || !nonceMatches(receivedState, claims.nonce)) return null;
  if (claims.returnTo !== undefined && typeof claims.returnTo !== "string") return null;
  if (claims.returnTo !== undefined) {
    const { APP_URL } = requireConfig(["APP_URL"]);
    try {
      if (safeReturnTo(claims.returnTo, APP_URL) !== claims.returnTo) return null;
    } catch {
      return null;
    }
  }
  return {
    nonce: claims.nonce,
    ...(typeof claims.returnTo === "string" ? { returnTo: claims.returnTo } : {}),
  };
}
