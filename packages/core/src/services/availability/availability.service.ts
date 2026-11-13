import { NotFoundError, ValidationError } from "../../http/errors";
import type { MentorRepositoryPort } from "../mentors/mentor-repository.port";
import type { AvailabilityRepositoryPort } from "./availability-repository.port";
import type { MentorSlotDto, PublicMentorSlotDto } from "./slot.types";

const MINIMUM_LEAD_TIME_MS = 2 * 60 * 60 * 1000;

export class AvailabilityService {
  private readonly availabilityRepository: AvailabilityRepositoryPort;
  private readonly mentorRepository: MentorRepositoryPort;
  private readonly now: () => Date;

  constructor({ availabilityRepository, mentorRepository, now }: {
    availabilityRepository: AvailabilityRepositoryPort;
    mentorRepository: MentorRepositoryPort;
    now: () => Date;
  }) {
    this.availabilityRepository = availabilityRepository;
    this.mentorRepository = mentorRepository;
    this.now = now;
  }

  async listForMentor(userId: string): Promise<MentorSlotDto[]> {
    const now = this.now();
    const slots = await this.availabilityRepository.listForMentor(userId);
    return slots.map((slot) => ({ ...slot, isPast: slot.startsAt.getTime() < now.getTime() }));
  }

  async publish(userId: string, startsAt: string): Promise<MentorSlotDto> {
    const instant = new Date(startsAt);
    if (!Number.isFinite(instant.getTime())) {
      throw new ValidationError("Enter a valid start time", { startsAt: ["Enter a valid date and time"] });
    }
    const publishedAt = this.now();
    if (instant.getTime() < publishedAt.getTime() + MINIMUM_LEAD_TIME_MS) {
      throw new ValidationError("Choose a start time at least two hours from now", {
        startsAt: ["Choose a start time at least two hours from now"],
      });
    }

    const profile = await this.mentorRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundError("Mentor profile not found");
    if (!profile.sessionChannel?.trim()) {
      throw new ValidationError("Add a session channel before publishing availability", {
        sessionChannel: ["Add a session channel before publishing availability"],
      });
    }

    const slot = await this.availabilityRepository.publishForMentor(userId, instant, publishedAt);
    return { id: slot.id, startsAt: slot.startsAt, isPast: false };
  }

  async remove(userId: string, slotId: string): Promise<{ id: string }> {
    await this.availabilityRepository.removeForMentor(userId, slotId, this.now());
    return { id: slotId };
  }

  async publicSlots(slug: string): Promise<PublicMentorSlotDto[]> {
    const now = this.now();
    const slots = await this.availabilityRepository.listForPublishedSlug(slug);
    return slots
      .filter((slot) => slot.startsAt.getTime() >= now.getTime())
      .map((slot) => ({
        id: slot.id,
        startsAt: slot.startsAt,
        meetsLeadTime: slot.startsAt.getTime() >= now.getTime() + MINIMUM_LEAD_TIME_MS,
      }));
  }
}
