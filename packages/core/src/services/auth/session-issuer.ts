import { isInsecureHttpAllowed, requireJwtSecret } from "../../config/env";
import { buildSessionCookie, SESSION_TTL_SECONDS, signSession, type Role } from "../../http/auth";
import type { StoredRole, User } from "./user.types";

export interface IssuedSession {
  token: string;
  cookie: string;
  session: { userId: string; role: Role };
}

export function effectiveRole(user: Pick<User, "role">): StoredRole {
  return user.role;
}

export async function issueSession(user: Pick<User, "id" | "role">): Promise<IssuedSession> {
  const session = { userId: user.id, role: effectiveRole(user) };
  const token = await signSession(session, requireJwtSecret());
  const secure = process.env.NODE_ENV === "production" && !isInsecureHttpAllowed();
  return {
    token,
    cookie: buildSessionCookie(token, { secure, maxAgeSeconds: SESSION_TTL_SECONDS }),
    session,
  };
}
