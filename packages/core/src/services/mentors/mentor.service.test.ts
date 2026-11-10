import { describe, expect, it, vi } from "vitest";
import type { Mentor } from "./mentor.types";
import { MentorService } from "./mentor.service";
import { NotFoundError } from "../../http/errors";

const mentor: Mentor = { id: "1", name: "Ada", email: "ada@example.com", createdAt: new Date(0) };

function createService() {
  const mentorRepository = {
    findAll: vi.fn().mockResolvedValue([mentor]),
    findPublishedProfiles: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue(mentor),
    findProfileByUserId: vi.fn(), updateProfile: vi.fn(), publishProfile: vi.fn(), unpublishProfile: vi.fn(), findPublicProfile: vi.fn(),
  };
  return { service: new MentorService({ mentorRepository }), mentorRepository };
}

describe("MentorService", () => {
  it("lists mentors from the repository", async () => {
    const { service, mentorRepository } = createService();
    await expect(service.list()).resolves.toEqual([mentor]);
    expect(mentorRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("registers a mentor through the repository", async () => {
    const { service, mentorRepository } = createService();
    await expect(service.register({ name: "Ada", email: "ada@example.com" })).resolves.toBe(mentor);
    expect(mentorRepository.create).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" });
  });

  it("lets repository errors (for example duplicates) propagate as rejections", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.create.mockRejectedValue(new Error("duplicate"));
    await expect(service.register({ name: "Ada", email: "ada@example.com" })).rejects.toThrowError("duplicate");
  });

  it("lists published profile projections", async () => {
    const { service, mentorRepository } = createService();
    const published = [{ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [] }];
    mentorRepository.findPublishedProfiles.mockResolvedValue(published);
    await expect(service.listPublishedProfiles()).resolves.toEqual(published);
  });

  it("returns an owner projection with readiness and private channel", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.findProfileByUserId.mockResolvedValue({ id: "p1", publicWorkUrl: "https://example.test", bio: "  ", sessionChannel: "private-room", stackTags: ["React"], slug: "ada", publishedAt: new Date(1) });
    await expect(service.profile("u1")).resolves.toEqual({
      id: "p1", publicWorkUrl: "https://example.test", bio: "  ", sessionChannel: "private-room", stackTags: ["React"], slug: "ada", publishedAt: new Date(1),
      readiness: { publicWorkUrl: true, bio: false, sessionChannel: true },
    });
  });

  it("returns an empty owner projection for a draft and reports missing profiles", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.findProfileByUserId.mockResolvedValue({ id: "p1", stackTags: [] });
    await expect(service.profile("u1")).resolves.toMatchObject({ publicWorkUrl: null, bio: null, sessionChannel: null, stackTags: [], readiness: { publicWorkUrl: false, bio: false, sessionChannel: false } });
    mentorRepository.findProfileByUserId.mockResolvedValue(null);
    await expect(service.profile("missing")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("normalizes blank URL and channel fields before saving", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.updateProfile.mockResolvedValue(undefined);
    mentorRepository.findProfileByUserId.mockResolvedValue({ id: "p1", stackTags: [] });
    await service.updateProfile("u1", { publicWorkUrl: "", sessionChannel: "", stackTags: [] });
    expect(mentorRepository.updateProfile).toHaveBeenCalledWith("u1", { publicWorkUrl: null, sessionChannel: null, stackTags: [] });
  });

  it("runs publish and unpublish transitions and returns the owner profile", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.publishProfile.mockResolvedValue(undefined);
    mentorRepository.unpublishProfile.mockResolvedValue(undefined);
    mentorRepository.findProfileByUserId.mockResolvedValue({ id: "p1", slug: "ada", publishedAt: new Date(2), stackTags: [] });
    await expect(service.publishProfile("u1")).resolves.toMatchObject({ slug: "ada" });
    await expect(service.unpublishProfile("u1")).resolves.toMatchObject({ slug: "ada" });
    expect(mentorRepository.publishProfile).toHaveBeenCalledWith("u1");
    expect(mentorRepository.unpublishProfile).toHaveBeenCalledWith("u1");
  });

  it("returns only a public projection or a not-found error", async () => {
    const { service, mentorRepository } = createService();
    const projection = { slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [] };
    mentorRepository.findPublicProfile.mockResolvedValue(projection);
    await expect(service.publicProfile("ada")).resolves.toEqual(projection);
    mentorRepository.findPublicProfile.mockResolvedValue(null);
    await expect(service.publicProfile("missing")).rejects.toBeInstanceOf(NotFoundError);
  });
});
