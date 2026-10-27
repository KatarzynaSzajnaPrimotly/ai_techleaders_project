import { requireJwtSecret } from "../config/env";
import { logger } from "../logger";
import { ForbiddenError, ServiceUnavailableError, UnauthorizedError } from "./errors";
import { hasSessionCookie, requireSession, type Role, type Session } from "./auth";

export type Access = "public" | "authenticated" | { roles: readonly Role[] };

type AccessWarningState = typeof globalThis & {
  __devmentor_warned_public_cookie_without_secret?: boolean;
};

const accessWarningState = globalThis as AccessWarningState;

export async function enforceAccess(request: Request, access: Access): Promise<Session | null> {
  if (access === "public") {
    if (!hasSessionCookie(request)) return null;

    try {
      return await requireSession(request);
    } catch (error) {
      if (error instanceof UnauthorizedError) return null;
      if (error instanceof ServiceUnavailableError) {
        if (!accessWarningState.__devmentor_warned_public_cookie_without_secret) {
          logger.warn("Session ignored on public route because JWT_SECRET is not configured");
          accessWarningState.__devmentor_warned_public_cookie_without_secret = true;
        }
        return null;
      }
      throw error;
    }
  }

  const session = await requireSession(request, requireJwtSecret());
  if (access === "authenticated") return session;
  if (!access.roles.includes(session.role)) throw new ForbiddenError();
  return session;
}
