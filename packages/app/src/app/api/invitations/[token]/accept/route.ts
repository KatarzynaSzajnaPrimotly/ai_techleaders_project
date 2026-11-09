import { apiHandler, issueSession, ok } from "@devmentor/core";
import { withScope } from "../../../../../server/container";
import { resolveCurrentSession } from "../../../../../server/current-session";

export const dynamic = "force-dynamic";

export const POST = apiHandler<{ params: Promise<{ token: string }> }, "authenticated">(async (_request, context, session) => {
  const { token } = await context.params;
  const accepted = await withScope(({ invitationService }) => invitationService.accept(token, session.userId));
  // Signing happens after the transaction commits so the token carries the newly incremented version.
  const issued = await issueSession(accepted.user);
  const response = ok({ roles: accepted.roles, publishDueAt: accepted.publishDueAt, redirectTo: "/mentor" });
  response.headers.append("set-cookie", issued.cookie);
  return response;
}, { access: "authenticated", resolveCurrentSession });
