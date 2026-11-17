import type { EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { ConflictError, NotFoundError, ValidationError, type AvailabilityRepositoryPort, type Booking, type Slot, type StoredMentorSlot } from "@devmentor/core";

const PROFILE = "MentorProfile" as unknown as EntityName<{ id: string; userId: string; sessionChannel: string | null; lastPublishedAvailabilityAt: Date | null; slug: string | null; publishedAt: Date | null }>;
const SLOT = "Slot" as unknown as EntityName<Slot>;
const BOOKING = "Booking" as unknown as EntityName<Booking>;
const UNIQUE_VIOLATION = "23505";

export function createAvailabilityRepository(em: EntityManager): AvailabilityRepositoryPort {
  async function excludeReserved(slots: Slot[]): Promise<Slot[]> {
    if (!slots.length) return slots;
    const reservations = await em.find<Booking>(BOOKING, {
      slotId: { $in: slots.map(({ id }) => id) },
      $or: [
        { status: "confirmed" },
        { status: "pending_payment", expiresAt: { $gt: new Date() } },
      ],
    });
    const reserved = new Set(reservations.map(({ slotId }) => slotId));
    return slots.filter(({ id }) => !reserved.has(id));
  }

  return {
    async listForMentor(userId: string): Promise<StoredMentorSlot[]> {
      const profile = await em.findOne(PROFILE, { userId });
      if (!profile) throw new NotFoundError("Mentor profile not found");
      const slots = await excludeReserved(await em.find<Slot>(SLOT, { mentorProfileId: profile.id, removedAt: null }, { orderBy: { startsAt: "asc" } }));
      return slots.map(({ id, startsAt }) => ({ id, startsAt }));
    },

    async publishForMentor(userId: string, startsAt: Date, publishedAt: Date): Promise<Slot> {
      try {
        return await em.transactional(async (tx) => {
          const profile = await tx.findOne(PROFILE, { userId }, { lockMode: 2 });
          if (!profile) throw new NotFoundError("Mentor profile not found");
          if (!profile.sessionChannel?.trim()) throw new ValidationError("Add a session channel before publishing availability", { sessionChannel: ["Add a session channel before publishing availability"] });
          profile.lastPublishedAvailabilityAt = publishedAt;
          const slot = tx.create<Slot>(SLOT, { mentorProfileId: profile.id, startsAt, removedAt: null, createdAt: publishedAt });
          await tx.flush();
          return slot;
        });
      } catch (error) {
        const detail = error as { code?: string; constraint?: string; message?: string };
        if (detail.code === UNIQUE_VIOLATION && detail.constraint?.includes("slots")) {
          throw new ConflictError("A slot is already published at this time");
        }
        throw error;
      }
    },

    async removeForMentor(userId: string, slotId: string, removedAt: Date): Promise<void> {
      const profile = await em.findOne(PROFILE, { userId });
      if (!profile) throw new NotFoundError("Mentor profile not found");
      const slot = await em.findOne<Slot>(SLOT, { id: slotId, mentorProfileId: profile.id, removedAt: null });
      if (!slot) throw new NotFoundError("Availability slot not found");
      slot.removedAt = removedAt;
      await em.flush();
    },

    async listForPublishedSlug(slug: string): Promise<Slot[]> {
      const profile = await em.findOne(PROFILE, { slug, publishedAt: { $ne: null } });
      if (!profile) throw new NotFoundError("Mentor page not found");
      return excludeReserved(await em.find<Slot>(SLOT, { mentorProfileId: profile.id, removedAt: null }, { orderBy: { startsAt: "asc" } }));
    },
  };
}
