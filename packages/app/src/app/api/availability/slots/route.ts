import { apiHandler, parseWithSchema, slotCreateSchema } from "@devmentor/core";
import { withScope } from "../../../../server/container";
import { resolveCurrentSession } from "../../../../server/current-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler((_request, _context, session) =>
  withScope(({ availabilityService }) => availabilityService.listForMentor(session.userId)),
  { access: { roles: ["mentor"] }, resolveCurrentSession },
);

export const POST = apiHandler(async (request, _context, session) => {
  const input = parseWithSchema(slotCreateSchema, await request.json());
  return withScope(({ availabilityService }) => availabilityService.publish(session.userId, input.startsAt));
}, { access: { roles: ["mentor"] }, resolveCurrentSession });
