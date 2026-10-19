import { jwtVerify, SignJWT } from "jose";
import { requireJwtSecret } from "../config/env";
import { ForbiddenError, UnauthorizedError } from "./errors";

const ALGORITHM = "HS256";

export const SESSION_COOKIE = "devmentor_session";
// 24h: there is no refresh-token flow in the MVP, so the lifetime is short and fixed.
export const SESSION_TTL_SECONDS = 24 * 60 * 60;

export interface Session {
  userId: string;
  role: string;
}

const encodeSecret = (secret: string) => new TextEncoder().encode(secret);

export function signSession(session: Session, secret: string, ttlSeconds = SESSION_TTL_SECONDS): Promise<string> {
  return new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(encodeSecret(secret));
}

export async function verifySession(token: string, secret: string): Promise<Session> {
  try {
    const { payload } = await jwtVerify(token, encodeSecret(secret), { algorithms: [ALGORITHM] });
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") throw new Error("Malformed claims");
    return { userId: payload.sub, role: payload.role };
  } catch {
    throw new UnauthorizedError("Invalid or expired session");
  }
}

function readCookie(header: string | null, name: string): string | undefined {
  return header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function requireSession(request: Request, secret: string = requireJwtSecret()): Promise<Session> {
  const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!token) throw new UnauthorizedError();
  return verifySession(token, secret);
}

export function requireRole(session: Session, role: string): void {
  if (session.role !== role) throw new ForbiddenError();
}

// Fails closed: a missing or different owner id is a denial, never a best-effort allow.
export function assertOwns(session: Session, ownerId: string | null | undefined): void {
  if (!ownerId || ownerId !== session.userId) throw new ForbiddenError();
}

export function buildSessionCookie(
  token: string,
  { secure, maxAgeSeconds = SESSION_TTL_SECONDS }: { secure: boolean; maxAgeSeconds?: number },
): string {
  const parts = [`${SESSION_COOKIE}=${token}`, "HttpOnly", "SameSite=Lax", "Path=/", `Max-Age=${maxAgeSeconds}`];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie(secure: boolean): string {
  return buildSessionCookie("", { secure, maxAgeSeconds: 0 });
}
