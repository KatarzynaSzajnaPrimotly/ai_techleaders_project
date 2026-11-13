import { ValidationError } from "../../http/errors";
import type { BookingRepositoryPort } from "./booking-repository.port";

export const BOOKING_HOLD_MINUTES = 10;
export const BOOKING_MIN_LEAD_MINUTES = 120;

export interface StartBookingInput { slotId: string; lengthMinutes: number }
export interface BookingClock { now(): Date }
export interface BookingServiceDependencies { bookingRepository: BookingRepositoryPort; now: () => Date }

export class BookingService {
  private readonly repository: BookingRepositoryPort;
  private readonly now: () => Date;

  constructor({ bookingRepository, now }: BookingServiceDependencies) {
    this.repository = bookingRepository;
    this.now = now;
  }

  async start(menteeUserId: string, input: StartBookingInput) {
    if (!Number.isInteger(input.lengthMinutes) || (input.lengthMinutes !== 25 && input.lengthMinutes !== 50)) {
      throw new ValidationError("Session length must be 25 or 50 minutes", { lengthMinutes: ["Choose 25 or 50 minutes"] });
    }
    const now = this.now();
    return this.repository.createHold({
      slotId: input.slotId,
      menteeUserId,
      lengthMinutes: input.lengthMinutes,
      now,
      holdExpiresAt: new Date(now.getTime() + BOOKING_HOLD_MINUTES * 60_000),
    });
  }
}
