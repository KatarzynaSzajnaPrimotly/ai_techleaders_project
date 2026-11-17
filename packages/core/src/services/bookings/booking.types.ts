/* c8 ignore file -- type-only domain contracts; no runtime behavior. */
export type BookingStatus = "pending_payment" | "confirmed" | "completed" | "cancelled" | "expired" | "payment_failed";

export interface Booking {
  id: string;
  slotId: string;
  menteeUserId: string;
  mentorProfileId: string;
  lengthMinutes: 25 | 50;
  priceCents: number;
  currency: "EUR";
  status: BookingStatus;
  startsAt: Date;
  bookedAt: Date | null;
  expiresAt: Date | null;
  checkoutSessionId: string | null;
  paymentStatus: "not_started" | "checkout_open" | "paid" | "refund_pending" | "refunded" | "failed";
  createdAt: Date;
}
