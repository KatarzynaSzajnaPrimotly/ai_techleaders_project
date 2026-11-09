import { isInsecureHttpAllowed, requireJwtSecret } from "../../config/env";
import { parseEnv } from "../../config/env-schema";
import { buildSessionCookie, SESSION_TTL_SECONDS, signSession, type Role } from "../../http/auth";
import type { User } from "./user.types";

export interface IssuedSession {
  token: string;
  cookie: string;
  session: { userId: string; role: Role; roles: Role[]; sessionVersion: number };
}

export function effectiveRole(user: Pick<User, "email" | "role" | "roles">, operatorEmails: readonly string[] = parseEnv().OPERATOR_EMAILS): Role {
  const roles = user.roles ?? [user.role];
  if (roles.includes("mentor")) return "mentor";
  if (operatorEmails.includes(user.email.trim().toLowerCase())) return "operator";
  return "mentee";
}

export async function issueSession(user: Pick<User, "id" | "email" | "role" | "roles" | "sessionVersion">): Promise<IssuedSession> {
  const secret = requireJwtSecret();
  const isOperator = effectiveRole(user) === "operator";
  const roles = [...new Set<Role>([...(user.roles ?? [user.role]), ...(isOperator ? ["operator" as const] : [])])];
  const session = { userId: user.id, role: effectiveRole(user), roles, sessionVersion: user.sessionVersion };
  const token = await signSession(session, secret);
  const secure = process.env.NODE_ENV === "production" && !isInsecureHttpAllowed();
  return {
    token,
    cookie: buildSessionCookie(token, { secure, maxAgeSeconds: SESSION_TTL_SECONDS }),
    session,
  };
}
