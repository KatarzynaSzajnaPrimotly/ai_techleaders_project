import { isInsecureHttpAllowed, requireJwtSecret } from "../../config/env";
import { parseEnv } from "../../config/env-schema";
import { buildSessionCookie, SESSION_TTL_SECONDS, signSession, type Role } from "../../http/auth";
import type { User } from "./user.types";

export interface IssuedSession {
  token: string;
  cookie: string;
  session: { userId: string; role: Role };
}

export function effectiveRole(user: Pick<User, "email" | "role">, operatorEmails: readonly string[] = parseEnv().OPERATOR_EMAILS): Role {
  if (user.role !== "mentor" && operatorEmails.includes(user.email.trim().toLowerCase())) return "operator";
  return user.role;
}

export async function issueSession(user: Pick<User, "id" | "email" | "role">): Promise<IssuedSession> {
  const secret = requireJwtSecret();
  const session = { userId: user.id, role: effectiveRole(user) };
  const token = await signSession(session, secret);
  const secure = process.env.NODE_ENV === "production" && !isInsecureHttpAllowed();
  return {
    token,
    cookie: buildSessionCookie(token, { secure, maxAgeSeconds: SESSION_TTL_SECONDS }),
    session,
  };
}
