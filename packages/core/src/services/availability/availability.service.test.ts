import { describe, expect, it, vi } from "vitest";
import { NotFoundError, ValidationError } from "../../http/errors";
import type { MentorRepositoryPort } from "../mentors/mentor-repository.port";
import type { AvailabilityRepositoryPort } from "./availability-repository.port";
import { AvailabilityService } from "./availability.service";

const now = new Date("2026-11-10T16:00:00.000Z");
const start = "2026-11-10T18:00:00.000Z";

function setup() {
  const availabilityRepository = {
    listForMentor: vi.fn().mockResolvedValue([]),
    publishForMentor: vi.fn().mockResolvedValue({ id: "slot-1", mentorProfileId: "profile-1", startsAt: new Date(start), removedAt: null, createdAt: now }),
    removeForMentor: vi.fn().mockResolvedValue(undefined),
    listForPublishedSlug: vi.fn().mockResolvedValue([]),
  } satisfies AvailabilityRepositoryPort;
  const mentorRepository = { findProfileByUserId: vi.fn().mockResolvedValue({ id: "profile-1", sessionChannel: "Meet" }) } as unknown as MentorRepositoryPort;
  const service = new AvailabilityService({ availabilityRepository, mentorRepository, now: () => now });
  return { service, availabilityRepository, mentorRepository };
}

describe("AvailabilityService", () => {
  it("lists the current mentor's slots", async () => {
    const { service, availabilityRepository } = setup();
    await expect(service.listForMentor("owner-1")).resolves.toEqual([]);
    expect(availabilityRepository.listForMentor).toHaveBeenCalledWith("owner-1");
  });

  it("accepts a slot exactly two hours in the future and uses the server clock", async () => {
    const { service, availabilityRepository } = setup();
    await expect(service.publish("owner-1", start)).resolves.toEqual({ id: "slot-1", startsAt: new Date(start), isPast: false });
    expect(availabilityRepository.publishForMentor).toHaveBeenCalledWith("owner-1", new Date(start), now);
  });

  it.each(["not-a-date", "2026-11-10T17:59:59.999Z"]) ("rejects invalid or too-soon start time %s", async (value) => {
    const { service, availabilityRepository } = setup();
    await expect(service.publish("owner-1", value)).rejects.toBeInstanceOf(ValidationError);
    expect(availabilityRepository.publishForMentor).not.toHaveBeenCalled();
  });

  it("requires an existing mentor profile and a private session channel", async () => {
    const { service, mentorRepository, availabilityRepository } = setup();
    vi.mocked(mentorRepository.findProfileByUserId).mockResolvedValueOnce(null);
    await expect(service.publish("missing", start)).rejects.toBeInstanceOf(NotFoundError);
    vi.mocked(mentorRepository.findProfileByUserId).mockResolvedValueOnce({ id: "profile-1", sessionChannel: " " } as never);
    await expect(service.publish("owner-1", start)).rejects.toMatchObject({ fieldErrors: { sessionChannel: [expect.any(String)] } });
    expect(availabilityRepository.publishForMentor).not.toHaveBeenCalled();
  });

  it("removes a slot and returns its identifier", async () => {
    const { service, availabilityRepository } = setup();
    await expect(service.remove("owner-1", "slot-1")).resolves.toEqual({ id: "slot-1" });
    expect(availabilityRepository.removeForMentor).toHaveBeenCalledWith("owner-1", "slot-1", now);
  });

  it("filters past slots and annotates the two-hour public lead-time boundary", async () => {
    const { service, availabilityRepository } = setup();
    vi.mocked(availabilityRepository.listForPublishedSlug).mockResolvedValue([
      { id: "past", mentorProfileId: "p1", startsAt: new Date("2026-11-10T15:59:59.999Z"), removedAt: null, createdAt: now },
      { id: "soon", mentorProfileId: "p1", startsAt: new Date("2026-11-10T17:00:00.000Z"), removedAt: null, createdAt: now },
      { id: "ready", mentorProfileId: "p1", startsAt: new Date(start), removedAt: null, createdAt: now },
    ]);
    await expect(service.publicSlots("ada")).resolves.toEqual([
      { id: "soon", startsAt: new Date("2026-11-10T17:00:00.000Z"), meetsLeadTime: false },
      { id: "ready", startsAt: new Date(start), meetsLeadTime: true },
    ]);
  });
});
