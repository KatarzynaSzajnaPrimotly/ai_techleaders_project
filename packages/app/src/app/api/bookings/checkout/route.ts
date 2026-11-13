import { apiHandler, bookingCheckoutSchema, parseWithSchema } from "@devmentor/core";
import { withScope } from "../../../../server/container";
import { resolveCurrentSession } from "../../../../server/current-session";

export const dynamic = "force-dynamic";

export const POST = apiHandler(async (request, _context, session) => {
  const input = parseWithSchema(bookingCheckoutSchema, await request.json());
  return withScope(({ bookingPaymentService }) => bookingPaymentService.createCheckout(session.userId, input.bookingId));
}, { access: { roles: ["mentee"] }, resolveCurrentSession });
