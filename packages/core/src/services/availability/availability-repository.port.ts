import type { Slot, StoredMentorSlot } from "./slot.types";

export interface AvailabilityRepositoryPort {
  listForMentor(userId: string): Promise<StoredMentorSlot[]>;
  publishForMentor(userId: string, startsAt: Date, publishedAt: Date): Promise<Slot>;
  removeForMentor(userId: string, slotId: string, removedAt: Date): Promise<void>;
  listForPublishedSlug(slug: string): Promise<Slot[]>;
}
