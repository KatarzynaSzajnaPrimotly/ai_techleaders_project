import { ConflictError, NotFoundError, ValidationError } from "@devmentor/core";
import { describe, expect, it, vi } from "vitest";
import { createAvailabilityRepository } from "./availability.repository";

const profile = { id: "profile-1", userId: "owner-1", sessionChannel: "Meet", lastPublishedAvailabilityAt: null, slug: "ada", publishedAt: new Date(0) };
const startsAt = new Date("2026-11-23T18:00:00.000Z");
const publishedAt = new Date("2026-11-10T16:00:00.000Z");

function setup(overrides: { profile?: unknown; slot?: unknown; flushError?: Error } = {}) {
  const tx = {
    findOne: vi.fn().mockResolvedValue(overrides.profile === undefined ? { ...profile } : overrides.profile),
    create: vi.fn().mockReturnValue({ id: "slot-1", mentorProfileId: "profile-1", startsAt, removedAt: null, createdAt: publishedAt }),
    flush: vi.fn().mockResolvedValue(undefined),
  };
  if (overrides.flushError) tx.flush.mockRejectedValue(overrides.flushError);
  const em = {
    findOne: vi.fn().mockImplementation((_entity: unknown, query: { id?: string }) => query.id ? overrides.slot ?? null : overrides.profile === undefined ? { ...profile } : overrides.profile),
    find: vi.fn().mockResolvedValue([]),
    flush: vi.fn().mockResolvedValue(undefined),
    transactional: vi.fn(async (run: (manager: typeof tx) => Promise<unknown>) => run(tx)),
  };
  return { repository: createAvailabilityRepository(em as never), em, tx };
}

describe("createAvailabilityRepository", () => {
  it("lists active slots for the profile belonging to a user", async () => {
    const slot = { id: "slot-1", mentorProfileId: "profile-1", startsAt, removedAt: null, createdAt: publishedAt };
    const { repository, em } = setup();
    vi.mocked(em.find).mockResolvedValue([slot] as never);
    await expect(repository.listForMentor("owner-1")).resolves.toEqual([{ id: "slot-1", startsAt }]);
    expect(em.find).toHaveBeenCalledWith("Slot", { mentorProfileId: "profile-1", removedAt: null }, { orderBy: { startsAt: "asc" } });
  });

  it("requires a mentor profile when listing or removing", async () => {
    const { repository } = setup({ profile: null });
    await expect(repository.listForMentor("missing")).rejects.toBeInstanceOf(NotFoundError);
    await expect(repository.removeForMentor("missing", "slot-1", publishedAt)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("publishes a slot and updates the most-recent availability timestamp atomically", async () => {
    const { repository, tx } = setup();
    const created = await repository.publishForMentor("owner-1", startsAt, publishedAt);
    expect(created).toMatchObject({ id: "slot-1", startsAt });
    expect(tx.findOne).toHaveBeenCalledWith("MentorProfile", { userId: "owner-1" }, { lockMode: 2 });
    expect(tx.create).toHaveBeenCalledWith("Slot", { mentorProfileId: "profile-1", startsAt, removedAt: null, createdAt: publishedAt });
    expect(tx.flush).toHaveBeenCalledOnce();
    await expect(tx.findOne.mock.results[0]?.value).resolves.toMatchObject({ lastPublishedAvailabilityAt: publishedAt });
  });

  it("refuses publication when the channel was cleared before the transaction", async () => {
    const { repository } = setup({ profile: { ...profile, sessionChannel: " " } });
    await expect(repository.publishForMentor("owner-1", startsAt, publishedAt)).rejects.toBeInstanceOf(ValidationError);
  });

  it("turns duplicate active-slot violations into a conflict", async () => {
    const duplicate = Object.assign(new Error("duplicate"), { code: "23505", constraint: "slots_active_profile_start_unique" });
    const { repository } = setup({ flushError: duplicate });
    await expect(repository.publishForMentor("owner-1", startsAt, publishedAt)).rejects.toBeInstanceOf(ConflictError);
  });

  it("rethrows unexpected publication failures unchanged", async () => {
    const failure = new Error("database unavailable");
    const { repository } = setup({ flushError: failure });
    await expect(repository.publishForMentor("owner-1", startsAt, publishedAt)).rejects.toBe(failure);
  });

  it("soft-removes only a slot owned by the profile", async () => {
    const slot = { id: "slot-1", mentorProfileId: "profile-1", startsAt, removedAt: null, createdAt: publishedAt };
    const { repository, em } = setup({ slot });
    await repository.removeForMentor("owner-1", "slot-1", publishedAt);
    expect(em.findOne).toHaveBeenCalledWith("Slot", { id: "slot-1", mentorProfileId: "profile-1", removedAt: null });
    expect(slot.removedAt).toBe(publishedAt);
    expect(em.flush).toHaveBeenCalledOnce();
  });

  it("returns only slots for published pages", async () => {
    const slot = { id: "slot-1", mentorProfileId: "profile-1", startsAt, removedAt: null, createdAt: publishedAt };
    const { repository, em } = setup();
    vi.mocked(em.find).mockResolvedValue([slot] as never);
    await expect(repository.listForPublishedSlug("ada")).resolves.toEqual([slot]);
    expect(em.findOne).toHaveBeenCalledWith("MentorProfile", { slug: "ada", publishedAt: { $ne: null } });
  });

  it("rejects a public slot query for an unpublished or unknown slug", async () => {
    const { repository } = setup({ profile: null });
    await expect(repository.listForPublishedSlug("hidden")).rejects.toBeInstanceOf(NotFoundError);
  });
});
