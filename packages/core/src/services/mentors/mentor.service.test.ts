import { describe, expect, it, vi } from "vitest";
import type { Mentor } from "./mentor.types";
import { MentorService } from "./mentor.service";
import { NotFoundError, ServiceUnavailableError, ValidationError } from "../../http/errors";

const mentor: Mentor = { id: "1", name: "Ada", email: "ada@example.com", createdAt: new Date(0) };

function createService() {
  const mentorRepository = {
    findAll: vi.fn().mockResolvedValue([mentor]),
    findPublishedProfiles: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue(mentor),
    findProfileByUserId: vi.fn(), findProfileById: vi.fn(), updateProfile: vi.fn(), updatePrices: vi.fn(), publishProfile: vi.fn(), unpublishProfile: vi.fn(), findPublicProfile: vi.fn(),
  };
  const platformSettingsService = {
    get: vi.fn().mockReturnValue({ currency: "EUR", priceBounds: { p25: { minCents: 1000, maxCents: 60000 }, p50: { minCents: 18000, maxCents: 120000 } } }),
    getOrNull: vi.fn().mockReturnValue({ currency: "EUR", priceBounds: { p25: { minCents: 1000, maxCents: 60000 }, p50: { minCents: 18000, maxCents: 120000 } } }),
  };
  return { service: new MentorService({ mentorRepository, platformSettingsService }), mentorRepository, platformSettingsService };
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
      lastPublishedAvailabilityAt: null, prices: null, readiness: { publicWorkUrl: true, bio: false, sessionChannel: true },
    });
  });

  it("returns an empty owner projection for a draft and reports missing profiles", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.findProfileByUserId.mockResolvedValue({ id: "p1", stackTags: [] });
    await expect(service.profile("u1")).resolves.toMatchObject({ publicWorkUrl: null, bio: null, sessionChannel: null, stackTags: [], prices: null, readiness: { publicWorkUrl: false, bio: false, sessionChannel: false } });
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
    const projection = { slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [], sessionChannel: "private", publishedAt: new Date(1), price25Cents: 2500, price50Cents: 25000 };
    mentorRepository.findPublicProfile.mockResolvedValue(projection);
    await expect(service.publicProfile("ada")).resolves.toEqual({ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [], prices: { price25Cents: 2500, price50Cents: 25000, currency: "EUR" }, isBookable: true });
    mentorRepository.findPublicProfile.mockResolvedValue(null);
    await expect(service.publicProfile("missing")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("updates both prices in one owner-scoped write and returns cents with configured bounds", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.updatePrices.mockResolvedValue({ id: "p1", price25Cents: 1000, price50Cents: 120000 });
    await expect(service.updatePrices("u1", { price25: "10.00", price50: "1200" })).resolves.toMatchObject({
      prices: { price25Cents: 1000, price50Cents: 120000, currency: "EUR" },
      priceBounds: { p25: { minCents: 1000, maxCents: 60000 } },
    });
    expect(mentorRepository.updatePrices).toHaveBeenCalledWith("u1", 1000, 120000);
  });

  it("rejects out-of-bound prices with the inclusive configured limits", async () => {
    const { service, mentorRepository } = createService();
    await expect(service.updatePrices("u1", { price25: "9.99", price50: "180.00" })).rejects.toMatchObject({
      fieldErrors: { price25: ["Enter an amount between €10.00 and €600.00"] },
    });
    expect(mentorRepository.updatePrices).not.toHaveBeenCalled();
  });

  it.each([
    ["25-minute minimum", "10.00", "180.00", true],
    ["25-minute maximum", "600.00", "180.00", true],
    ["25-minute minimum minus one cent", "9.99", "180.00", false],
    ["25-minute maximum plus one cent", "600.01", "180.00", false],
    ["50-minute minimum", "10.00", "180.00", true],
    ["50-minute maximum", "10.00", "1200.00", true],
    ["50-minute minimum minus one cent", "10.00", "179.99", false],
    ["50-minute maximum plus one cent", "10.00", "1200.01", false],
  ])("checks the inclusive bounds at the %s", async (_label, price25, price50, accepted) => {
    const { service, mentorRepository } = createService();
    mentorRepository.updatePrices.mockResolvedValue({ id: "p1", price25Cents: 1000, price50Cents: 18000 });
    const update = service.updatePrices("u1", { price25, price50 });
    if (accepted) {
      await expect(update).resolves.toMatchObject({ prices: { currency: "EUR" } });
      expect(mentorRepository.updatePrices).toHaveBeenCalledTimes(1);
    } else {
      await expect(update).rejects.toBeInstanceOf(ValidationError);
      expect(mentorRepository.updatePrices).not.toHaveBeenCalled();
    }
  });

  it("refuses writes when the pricing bounds are not configured", async () => {
    const { service, mentorRepository, platformSettingsService } = createService();
    platformSettingsService.get.mockImplementation(() => { throw new ServiceUnavailableError("bounds missing"); });
    await expect(service.updatePrices("u1", { price25: "10", price50: "180" })).rejects.toBeInstanceOf(ServiceUnavailableError);
    expect(mentorRepository.updatePrices).not.toHaveBeenCalled();
  });

  it("only exposes prices for published profiles whose channel and both prices are within bounds", async () => {
    const { service, platformSettingsService } = createService();
    const profile = { publishedAt: new Date(1), sessionChannel: "Private", price25Cents: 2500, price50Cents: 25000 };
    expect(service.isBookable(profile)).toBe(true);
    expect(service.isBookable({ ...profile, sessionChannel: " " })).toBe(false);
    expect(service.isBookable({ ...profile, publishedAt: null })).toBe(false);
    expect(service.isBookable({ ...profile, price25Cents: null })).toBe(false);
    expect(service.isBookable({ ...profile, price50Cents: 120001 })).toBe(false);
    platformSettingsService.getOrNull.mockReturnValue(null);
    expect(service.isBookable(profile)).toBe(false);
  });

  it("returns a server-owned session price only for a currently bookable mentor", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.findProfileById.mockResolvedValue({ id: "p1", publishedAt: new Date(1), sessionChannel: "Private", price25Cents: 2500, price50Cents: 25000 });
    await expect(service.getPriceFor("p1", 25)).resolves.toEqual({ amountCents: 2500, currency: "EUR" });
    mentorRepository.findProfileById.mockResolvedValue({ id: "p1", publishedAt: null, sessionChannel: "Private", price25Cents: 2500, price50Cents: 25000 });
    await expect(service.getPriceFor("p1", 25)).rejects.toBeInstanceOf(ValidationError);
  });
});
