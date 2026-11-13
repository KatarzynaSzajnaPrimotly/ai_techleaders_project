import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { parseEnv, requireConfig, ValidationError, type PaymentGatewayPort, type VerifiedPaymentEvent } from "@devmentor/core";
import { z } from "zod";

const checkoutSessions = new Map<string, { id: string; url: string }>();

const paymentEventSchema = z.object({
  id: z.string().min(1),
  type: z.literal("checkout.paid"),
  checkoutSessionId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.literal("EUR"),
});

export function createTestPaymentGateway(): PaymentGatewayPort {
  const env = parseEnv();
  if ((env.NODE_ENV === "production" && env.INTEGRATION_TEST !== "true") || env.PAYMENT_GATEWAY !== "test") {
    throw new Error("Test payment gateway is disabled");
  }
  const { APP_URL, PAYMENT_WEBHOOK_SECRET } = requireConfig(["APP_URL", "PAYMENT_WEBHOOK_SECRET"]);
  const refunded = new Set<string>();

  return {
    async createCheckout(input) {
      const existing = checkoutSessions.get(input.idempotencyKey);
      if (existing) return existing;
      const id = randomUUID();
      const url = new URL(`/test-checkout/${id}`, APP_URL).toString();
      const session = { id, url };
      checkoutSessions.set(input.idempotencyKey, session);
      return session;
    },
    async verifyWebhook(rawBody, signature) {
      const expected = createHmac("sha256", PAYMENT_WEBHOOK_SECRET).update(rawBody).digest();
      if (!/^[a-f\d]{64}$/i.test(signature)) throw new ValidationError("Invalid payment signature");
      const provided = Buffer.from(signature, "hex");
      if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) throw new ValidationError("Invalid payment signature");
      let payload: unknown;
      try { payload = JSON.parse(rawBody); }
      catch { throw new ValidationError("Invalid payment event"); }
      const parsed = paymentEventSchema.safeParse(payload);
      if (!parsed.success) throw new ValidationError("Invalid payment event");
      return parsed.data satisfies VerifiedPaymentEvent;
    },
    async refund(input) {
      if (refunded.has(input.idempotencyKey)) return;
      refunded.add(input.idempotencyKey);
    },
  };
}
