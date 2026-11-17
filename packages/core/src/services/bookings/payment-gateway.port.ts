/* c8 ignore file -- type-only gateway contract; no runtime behavior. */
export interface CheckoutSession {
  id: string;
  url: string;
}

export interface VerifiedPaymentEvent {
  id: string;
  type: "checkout.paid";
  checkoutSessionId: string;
  amountCents: number;
  currency: "EUR";
}

export interface PaymentGatewayPort {
  createCheckout(input: { bookingId: string; idempotencyKey: string; amountCents: number; currency: "EUR" }): Promise<CheckoutSession>;
  verifyWebhook(rawBody: string, signature: string): Promise<VerifiedPaymentEvent>;
  refund(input: { checkoutSessionId: string; amountCents: number; idempotencyKey: string }): Promise<void>;
}
