import { apiHandler, parseWithSchema, slotIdSchema } from "@devmentor/core";
import { withScope } from "../../../../../server/container";
import { resolveCurrentSession } from "../../../../../server/current-session";

export const dynamic = "force-dynamic";

export const DELETE = apiHandler(async (_request, context: { params: Promise<{ id: string }> }, session) => {
  const id = parseWithSchema(slotIdSchema, (await context.params).id);
  return withScope(({ availabilityService }) => availabilityService.remove(session.userId, id));
}, { access: { roles: ["mentor"] }, resolveCurrentSession });
