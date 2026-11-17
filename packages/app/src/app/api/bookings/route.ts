import { apiHandler, bookingCreateSchema, parseWithSchema } from "@devmentor/core";
import { withScope } from "../../../server/container";
import { resolveCurrentSession } from "../../../server/current-session";

export const dynamic = "force-dynamic";

export const POST = apiHandler(async (request, _context, session) => {
  const input = parseWithSchema(bookingCreateSchema, await request.json());
  return withScope(({ bookingService }) => bookingService.start(session.userId, input));
}, { access: { roles: ["mentee"] }, resolveCurrentSession });
