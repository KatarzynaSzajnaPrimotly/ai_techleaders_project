import { EntityName, EntityManager } from "@mikro-orm/postgresql";
import { ConflictError, NotFoundError, ValidationError, type Booking, type BookingRepositoryPort } from "@devmentor/core";
import type { Slot } from "@devmentor/core";
import type { MentorProfile } from "@devmentor/core";

const BOOKING = "Booking" as unknown as EntityName<Booking>;
const SLOT = "Slot" as unknown as EntityName<Slot>;
const PROFILE = "MentorProfile" as unknown as EntityName<MentorProfile>;
const UNIQUE_VIOLATION = "23505";

export function createBookingRepository(em: EntityManager): BookingRepositoryPort {
  return {
    async createHold(input) {
      try {
        return await em.transactional(async (tx) => {
          const slot = await tx.findOne<Slot>(SLOT, { id: input.slotId }, { lockMode: 2 });
          if (!slot || slot.removedAt) throw new NotFoundError("Availability slot not found");
          if (slot.startsAt.getTime() - input.now.getTime() < 120 * 60_000) {
            throw new ValidationError("Bookings must start at least two hours ahead", { slotId: ["Choose a later slot"] });
          }
          const profile = await tx.findOne<MentorProfile>(PROFILE, { id: slot.mentorProfileId, publishedAt: { $ne: null } });
          if (!profile) throw new ValidationError("Mentor is not bookable", { slotId: ["Choose a published mentor slot"] });
          const priceCents = input.lengthMinutes === 25 ? profile.price25Cents : profile.price50Cents;
          if (!priceCents) throw new ValidationError("This session length is not priced", { lengthMinutes: ["Choose a priced session length"] });

          await tx.nativeUpdate<Booking>(BOOKING, { slotId: slot.id, status: "pending_payment", expiresAt: { $lte: input.now } }, { status: "expired" });
          const active = await tx.findOne<Booking>(BOOKING, { slotId: slot.id, status: { $in: ["pending_payment", "confirmed"] } });
          if (active) throw new ConflictError("This slot is already being booked");

          const booking = tx.create<Booking>(BOOKING, {
            slotId: slot.id,
            menteeUserId: input.menteeUserId,
            mentorProfileId: profile.id,
            lengthMinutes: input.lengthMinutes,
            priceCents,
            currency: "EUR",
            status: "pending_payment",
            startsAt: slot.startsAt,
            bookedAt: null,
            expiresAt: input.holdExpiresAt,
            checkoutSessionId: null,
            paymentStatus: "not_started",
            createdAt: input.now,
          });
          await tx.flush();
          return booking;
        });
      } catch (error) {
        const detail = error as { code?: string; constraint?: string };
        if (detail.code === UNIQUE_VIOLATION && detail.constraint === "bookings_active_slot_unique") {
          throw new ConflictError("This slot is already being booked");
        }
        throw error;
      }
    },
  };
}
