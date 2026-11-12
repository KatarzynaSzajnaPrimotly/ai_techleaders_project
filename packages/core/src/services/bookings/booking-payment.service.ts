import { ConflictError, ValidationError } from "../../http/errors";
import type { BookingRepositoryPort } from "./booking-repository.port";
import type { PaymentGatewayPort } from "./payment-gateway.port";

export interface BookingPaymentServiceDependencies {
  bookingRepository: BookingRepositoryPort;
  paymentGateway: PaymentGatewayPort;
  now: () => Date;
}

export class BookingPaymentService {
  constructor(private readonly dependencies: BookingPaymentServiceDependencies) {}

  async createCheckout(menteeUserId: string, bookingId: string) {
    const booking = await this.dependencies.bookingRepository.findPendingOwned(bookingId, menteeUserId);
    if (booking.expiresAt && booking.expiresAt <= this.dependencies.now()) throw new ConflictError("Booking hold has expired");
    const checkout = await this.dependencies.paymentGateway.createCheckout({ bookingId, amountCents: booking.priceCents, currency: "EUR" });
    await this.dependencies.bookingRepository.attachCheckoutSession(bookingId, checkout.id);
    return { bookingId, checkoutUrl: checkout.url, expiresAt: booking.expiresAt };
  }

  async handleWebhook(rawBody: string, signature: string) {
    const event = await this.dependencies.paymentGateway.verifyWebhook(rawBody, signature);
    if (event.amountCents <= 0 || event.currency !== "EUR") throw new ValidationError("Payment amount or currency is invalid");
    const result = await this.dependencies.bookingRepository.settlePayment(event, this.dependencies.now());
    if (result === "refund") {
      await this.dependencies.paymentGateway.refund({ checkoutSessionId: event.checkoutSessionId, amountCents: event.amountCents, idempotencyKey: event.id });
      await this.dependencies.bookingRepository.markRefunded(event.checkoutSessionId);
    }
    return { processed: result !== "ignored", outcome: result };
  }
}
