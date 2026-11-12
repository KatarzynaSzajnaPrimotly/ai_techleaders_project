import type { Booking } from "./booking.types";

export interface BookingRepositoryPort {
  createHold(input: { slotId: string; menteeUserId: string; lengthMinutes: 25 | 50; now: Date; holdExpiresAt: Date }): Promise<Booking>;
}
