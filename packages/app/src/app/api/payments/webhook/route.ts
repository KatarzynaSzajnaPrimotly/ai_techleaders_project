import { apiHandler, ValidationError } from "@devmentor/core";
import { withScope } from "../../../../server/container";

export const dynamic = "force-dynamic";

export const POST = apiHandler(async (request) => {
  const signature = request.headers.get("x-devmentor-payment-signature");
  if (!signature) throw new ValidationError("Payment signature is required");
  const rawBody = await request.text();
  return withScope(({ bookingPaymentService }) => bookingPaymentService.handleWebhook(rawBody, signature));
}, { access: "public", csrf: false });
