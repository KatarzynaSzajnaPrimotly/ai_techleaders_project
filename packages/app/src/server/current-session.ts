import { effectiveRole, type Session } from "@devmentor/core";
import { withScope } from "./container";

/** Rechecks the signed claims against the current account before they authorize work. */
export async function resolveCurrentSession(session: Session): Promise<Session | null> {
  return withScope(async ({ userRepository }) => {
    const user = await userRepository.findById(session.userId);
    if (!user || user.sessionVersion !== session.sessionVersion) return null;
    if (effectiveRole(user) !== session.role) return null;
    return session;
  });
}
