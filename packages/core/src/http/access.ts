import { requireJwtSecret } from "../config/env";
import { logger } from "../logger";
import { ForbiddenError, ServiceUnavailableError, UnauthorizedError } from "./errors";
import { hasSessionCookie, requireSession, type Role, type Session } from "./auth";

export type Access = "public" | "authenticated" | { roles: readonly Role[] };
export type CurrentSessionResolver = (session: Session) => Promise<Session | null>;

type AccessWarningState = typeof globalThis & {
  __devmentor_warned_public_cookie_without_secret?: boolean;
};

const accessWarningState = globalThis as AccessWarningState;

export async function enforceAccess(
  request: Request,
  access: Access,
  resolveCurrentSession?: CurrentSessionResolver,
): Promise<Session | null> {
  if (access === "public") {
    if (!hasSessionCookie(request)) return null;

    try {
      const session = await requireSession(request);
      return resolveCurrentSession ? await resolveCurrentSession(session) : session;
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

  if (!resolveCurrentSession) {
    throw new ServiceUnavailableError("Current account verification is not configured");
  }
  const verifiedSession = await requireSession(request, requireJwtSecret());
  const session = await resolveCurrentSession(verifiedSession);
  if (!session) throw new UnauthorizedError();
  if (access === "authenticated") return session;
  if (!access.roles.includes(session.role)) throw new ForbiddenError();
  return session;
}
