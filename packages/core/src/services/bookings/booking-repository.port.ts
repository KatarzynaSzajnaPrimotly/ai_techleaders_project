import type { Booking } from "./booking.types";

export interface BookingRepositoryPort {
  createHold(input: { slotId: string; menteeUserId: string; lengthMinutes: 25 | 50; now: Date; holdExpiresAt: Date }): Promise<Booking>;
  findPendingOwned(bookingId: string, menteeUserId: string): Promise<Booking>;
  attachCheckoutSession(bookingId: string, checkoutSessionId: string): Promise<void>;
  settlePayment(event: { id: string; checkoutSessionId: string; amountCents: number; currency: "EUR" }, now: Date): Promise<"confirmed" | "refund" | "ignored">;
  markRefunded(checkoutSessionId: string): Promise<void>;
}
