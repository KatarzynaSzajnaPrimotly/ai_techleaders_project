export interface Slot {
  id: string;
  mentorProfileId: string;
  startsAt: Date;
  removedAt: Date | null;
  createdAt: Date;
}

export interface MentorSlotDto {
  id: string;
  startsAt: Date;
  isPast: boolean;
}

export interface StoredMentorSlot {
  id: string;
  startsAt: Date;
}

export interface PublicMentorSlotDto {
  id: string;
  startsAt: Date;
  meetsLeadTime: boolean;
}
