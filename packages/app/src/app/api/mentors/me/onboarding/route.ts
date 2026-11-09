import { apiHandler } from "@devmentor/core";
import { withScope } from "../../../../../server/container";
import { resolveCurrentSession } from "../../../../../server/current-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (_request, _context, session) =>
  withScope(({ invitationService }) => invitationService.onboardingStatus(session.userId)),
{ access: { roles: ["mentor"] }, resolveCurrentSession });
