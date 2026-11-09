import { apiHandler } from "@devmentor/core";
import { withScope } from "../../../../server/container";
import { resolveCurrentSession } from "../../../../server/current-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler<{ params: Promise<{ token: string }> }, "public">(async (_request, context) => {
  const { token } = await context.params;
  return withScope(({ invitationService }) => invitationService.lookup(token));
}, { access: "public", resolveCurrentSession });
