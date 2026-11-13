import { describe, expect, it, vi } from "vitest";
import { ConflictError, ValidationError } from "../../http/errors";
import type { BookingRepositoryPort } from "./booking-repository.port";
import type { Booking } from "./booking.types";
import type { PaymentGatewayPort } from "./payment-gateway.port";
import { BookingPaymentService } from "./booking-payment.service";

const now = new Date("2026-11-12T12:00:00.000Z");
const booking = { id: "booking-1", priceCents: 5000, currency: "EUR" as const, expiresAt: new Date("2026-11-12T12:10:00.000Z") };

function setup(outcome: "confirmed" | "refund" | "ignored" = "confirmed") {
  const bookingRepository = {
    createHold: vi.fn(), findPendingOwned: vi.fn().mockResolvedValue(booking), attachCheckoutSession: vi.fn(),
    settlePayment: vi.fn().mockResolvedValue(outcome), markRefunded: vi.fn(),
  } satisfies BookingRepositoryPort;
  const paymentGateway = {
    createCheckout: vi.fn().mockResolvedValue({ id: "session-1", url: "https://payments.example/checkout" }),
    verifyWebhook: vi.fn().mockResolvedValue({ id: "event-1", type: "checkout.paid", checkoutSessionId: "session-1", amountCents: 5000, currency: "EUR" }),
    refund: vi.fn().mockResolvedValue(undefined),
  } satisfies PaymentGatewayPort;
  const service = new BookingPaymentService({ bookingRepository, paymentGateway, now: () => now });
  return { service, bookingRepository, paymentGateway };
}

describe("BookingPaymentService", () => {
  it("creates checkout from the stored price and attaches the session", async () => {
    const { service, bookingRepository, paymentGateway } = setup();
    await expect(service.createCheckout("mentee-1", "booking-1")).resolves.toMatchObject({ checkoutUrl: "https://payments.example/checkout" });
    expect(paymentGateway.createCheckout).toHaveBeenCalledWith({ bookingId: "booking-1", idempotencyKey: "booking-checkout:booking-1", amountCents: 5000, currency: "EUR" });
    expect(bookingRepository.attachCheckoutSession).toHaveBeenCalledWith("booking-1", "session-1");
  });

  it("uses a stable provider idempotency key when checkout creation is retried concurrently", async () => {
    const { service, paymentGateway, bookingRepository } = setup();
    const results = await Promise.all([
      service.createCheckout("mentee-1", "booking-1"),
      service.createCheckout("mentee-1", "booking-1"),
    ]);
    expect(paymentGateway.createCheckout).toHaveBeenCalledTimes(2);
    expect(paymentGateway.createCheckout).toHaveBeenNthCalledWith(1, expect.objectContaining({ idempotencyKey: "booking-checkout:booking-1" }));
    expect(paymentGateway.createCheckout).toHaveBeenNthCalledWith(2, expect.objectContaining({ idempotencyKey: "booking-checkout:booking-1" }));
    expect(results[0]?.checkoutUrl).toBe(results[1]?.checkoutUrl);
    expect(bookingRepository.attachCheckoutSession).toHaveBeenCalledTimes(2);
  });

  it("refuses an expired booking before contacting the gateway", async () => {
    const { service, paymentGateway } = setup();
    const expired = { ...booking, expiresAt: new Date(now.getTime() - 1) };
    const repo = service as unknown as { dependencies: { bookingRepository: BookingRepositoryPort } };
    vi.spyOn(repo.dependencies.bookingRepository, "findPendingOwned").mockResolvedValue(expired as Booking);
    await expect(service.createCheckout("mentee-1", "booking-1")).rejects.toBeInstanceOf(ConflictError);
    expect(paymentGateway.createCheckout).not.toHaveBeenCalled();
  });

  it("confirms signed, well-formed payment events through the repository", async () => {
    const { service, bookingRepository } = setup();
    await expect(service.handleWebhook("body", "sig")).resolves.toMatchObject({ outcome: "confirmed", processed: true });
    expect(bookingRepository.settlePayment).toHaveBeenCalledWith(expect.objectContaining({ amountCents: 5000 }), now);
  });

  it("refunds late payments idempotently and marks the booking refunded", async () => {
    const { service, bookingRepository, paymentGateway } = setup("refund");
    await service.handleWebhook("body", "sig");
    expect(paymentGateway.refund).toHaveBeenCalledWith({ checkoutSessionId: "session-1", amountCents: 5000, idempotencyKey: "event-1" });
    expect(bookingRepository.markRefunded).toHaveBeenCalledWith("session-1");
  });

  it("ignores duplicate events and rejects invalid charge amounts", async () => {
    const ignored = setup("ignored");
    await expect(ignored.service.handleWebhook("body", "sig")).resolves.toMatchObject({ outcome: "ignored", processed: false });
    expect(ignored.paymentGateway.refund).not.toHaveBeenCalled();
    const invalid = setup();
    invalid.paymentGateway.verifyWebhook.mockResolvedValue({ id: "e", type: "checkout.paid", checkoutSessionId: "s", amountCents: 0, currency: "EUR" });
    await expect(invalid.service.handleWebhook("body", "sig")).rejects.toBeInstanceOf(ValidationError);
  });
});
