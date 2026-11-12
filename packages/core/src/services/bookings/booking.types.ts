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
  createdAt: Date;
}
