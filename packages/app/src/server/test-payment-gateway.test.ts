import { createHmac, randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestPaymentGateway } from "./test-payment-gateway";

const secret = "local-test-webhook-secret-more-than-32-characters";
const event = JSON.stringify({ id: "event-1", type: "checkout.paid", checkoutSessionId: "session-1", amountCents: 5000, currency: "EUR" });
const signature = (body: string) => createHmac("sha256", secret).update(body).digest("hex");

function configure() {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("PAYMENT_GATEWAY", "test");
  vi.stubEnv("PAYMENT_WEBHOOK_SECRET", secret);
  vi.stubEnv("APP_URL", "http://localhost:3000");
}

afterEach(() => vi.unstubAllEnvs());

describe("test payment gateway", () => {
  it("creates a local checkout URL", async () => {
    configure();
    const gateway = createTestPaymentGateway();
    const checkout = await gateway.createCheckout({ bookingId: randomUUID(), amountCents: 5000, currency: "EUR" });
    expect(new URL(checkout.url).pathname).toBe(`/test-checkout/${checkout.id}`);
  });

  it("verifies webhook signature and event shape", async () => {
    configure();
    const gateway = createTestPaymentGateway();
    await expect(gateway.verifyWebhook(event, signature(event))).resolves.toMatchObject({ id: "event-1", checkoutSessionId: "session-1" });
    await expect(gateway.verifyWebhook(event, "bad")).rejects.toThrow("Invalid payment signature");
    await expect(gateway.verifyWebhook(event, "0".repeat(64))).rejects.toThrow("Invalid payment signature");
    await expect(gateway.verifyWebhook("not-json", signature("not-json"))).rejects.toThrow("Invalid payment event");
    const invalid = JSON.stringify({ id: "bad", type: "unknown" });
    await expect(gateway.verifyWebhook(invalid, signature(invalid))).rejects.toThrow("Invalid payment event");
  });

  it("rejects production and non-test configurations and makes refunds idempotent", async () => {
    configure();
    vi.stubEnv("NODE_ENV", "production");
    expect(() => createTestPaymentGateway()).toThrow("Test payment gateway is disabled");
    configure();
    const gateway = createTestPaymentGateway();
    const refund = { checkoutSessionId: "session-1", amountCents: 5000, idempotencyKey: "event-1" };
    await expect(gateway.refund(refund)).resolves.toBeUndefined();
    await expect(gateway.refund(refund)).resolves.toBeUndefined();
  });
});
