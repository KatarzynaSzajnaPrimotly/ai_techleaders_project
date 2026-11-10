import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "@devmentor/core";
import { createMentorRepository } from "./mentor.repository";

function createEm(overrides: Record<string, unknown> = {}) {
  const em = {
    find: vi.fn(),
    create: vi.fn(),
    flush: vi.fn(),
    findOne: vi.fn(),
    ...overrides,
  };
  return { ...em, transactional: vi.fn(async (run: (tx: unknown) => Promise<unknown>) => run(em as never)) };
}

const asEm = (em: ReturnType<typeof createEm>) => em as unknown as Parameters<typeof createMentorRepository>[0];

describe("createMentorRepository", () => {
  it("finds profiles by user id", async () => {
    const profile = { id: "p1", userId: "u1" };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(profile) });
    await expect(createMentorRepository(asEm(em)).findProfileByUserId("u1")).resolves.toBe(profile);
    expect(em.findOne).toHaveBeenCalledWith("MentorProfile", { userId: "u1" });
  });

  it("omits incomplete public list rows and defaults missing tags", async () => {
    const em = createEm({ find: vi.fn()
      .mockResolvedValueOnce([
        { userId: "u1", slug: null, publicWorkUrl: "url", bio: "bio" },
        { userId: "u2", slug: "two", publicWorkUrl: null, bio: "bio" },
        { userId: "u3", slug: "three", publicWorkUrl: "url", bio: "" },
        { userId: "u4", slug: "four", publicWorkUrl: "url", bio: "bio", stackTags: null },
      ])
      .mockResolvedValueOnce([]) });
    await expect(createMentorRepository(asEm(em)).findPublishedProfiles()).resolves.toEqual([
      { slug: "four", displayName: "Mentor", publicWorkUrl: "url", bio: "bio", stackTags: [] },
    ]);
  });

  it("updates a profile and rejects a missing profile", async () => {
    const profile = { id: "p1", userId: "u1", bio: "old" };
    const em = createEm({ findOne: vi.fn().mockResolvedValueOnce(profile).mockResolvedValueOnce(null), flush: vi.fn() });
    await expect(createMentorRepository(asEm(em)).updateProfile("u1", { bio: "new" })).resolves.toMatchObject({ bio: "new", updatedAt: expect.any(Date) });
    await expect(createMentorRepository(asEm(em)).updateProfile("u2", { bio: "new" })).rejects.toMatchObject({ status: 404 });
  });

  it("rejects missing price profiles and propagates flush failures", async () => {
    const missing = createEm({ findOne: vi.fn().mockResolvedValue(null) });
    await expect(createMentorRepository(asEm(missing)).updatePrices("u1", 1, 2)).rejects.toMatchObject({ status: 404 });
    const failure = new Error("flush failed");
    const profile = { userId: "u1" };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(profile), flush: vi.fn().mockRejectedValue(failure) });
    await expect(createMentorRepository(asEm(em)).updatePrices("u1", 1, 2)).rejects.toBe(failure);
  });

  it("unpublishes a profile and rejects missing profiles", async () => {
    const profile = { userId: "u1", publishedAt: new Date() };
    const em = createEm({ findOne: vi.fn().mockResolvedValueOnce(profile).mockResolvedValueOnce(null) });
    await expect(createMentorRepository(asEm(em)).unpublishProfile("u1")).resolves.toMatchObject({ publishedAt: null });
    await expect(createMentorRepository(asEm(em)).unpublishProfile("u2")).rejects.toMatchObject({ status: 404 });
  });

  it.each([
    [{ bio: "Builder" }, { publicWorkUrl: ["Add a link to your public work before publishing"] }],
    [{ publicWorkUrl: "https://example.test" }, { bio: ["Add a description before publishing"] }],
    [{ publicWorkUrl: "", bio: " " }, { publicWorkUrl: ["Add a link to your public work before publishing"], bio: ["Add a description before publishing"] }],
  ])("refuses to publish an incomplete profile", async (profileData, fieldErrors) => {
    const tx = createEm({ findOne: vi.fn().mockResolvedValue({ userId: "u1", ...profileData }) });
    const em = createEm({ findOne: vi.fn().mockResolvedValue({ id: "u1", displayName: "Ada" }) });
    em.transactional.mockImplementation(async (run) => run(tx as never));
    await expect(createMentorRepository(asEm(em)).publishProfile("u1")).rejects.toMatchObject({ status: 400, fieldErrors });
  });

  it("requires an existing profile when publishing", async () => {
    const tx = createEm({ findOne: vi.fn().mockResolvedValue(null) });
    const em = createEm({ findOne: vi.fn().mockResolvedValue(null) });
    em.transactional.mockImplementation(async (run) => run(tx as never));
    await expect(createMentorRepository(asEm(em)).publishProfile("missing")).rejects.toMatchObject({ status: 404 });
  });

  it("keeps a previously allocated slug stable when republishing", async () => {
    const profile = { userId: "u1", slug: "ada", publishedAt: null, publicWorkUrl: "https://example.test", bio: "Engineer" };
    const tx = createEm({ findOne: vi.fn().mockResolvedValue(profile), flush: vi.fn().mockResolvedValue(undefined) });
    const em = createEm({ findOne: vi.fn().mockResolvedValue({ id: "u1", displayName: "New Name" }) });
    em.transactional.mockImplementation(async (run) => run(tx as never));
    await expect(createMentorRepository(asEm(em)).publishProfile("u1")).resolves.toMatchObject({ slug: "ada", publishedAt: expect.any(Date) });
    expect(tx.findOne).toHaveBeenCalledTimes(1);
    expect(tx.flush).toHaveBeenCalledOnce();
  });

  it("allocates a unique slug after a candidate collision", async () => {
    const profile = { userId: "u1", publicWorkUrl: "https://example.test", bio: "Engineer" };
    const tx = createEm({ findOne: vi.fn()
      .mockResolvedValueOnce(profile).mockResolvedValueOnce({ id: "collision" })
      .mockResolvedValueOnce(profile).mockResolvedValueOnce(null), flush: vi.fn().mockResolvedValue(undefined) });
    const em = createEm({ findOne: vi.fn().mockResolvedValue({ id: "u1", displayName: "Ada" }) });
    em.transactional.mockImplementation(async (run) => run(tx as never));
    await expect(createMentorRepository(asEm(em)).publishProfile("u1")).resolves.toMatchObject({ slug: "ada-2", publishedAt: expect.any(Date) });
    expect(tx.findOne).toHaveBeenCalledTimes(4);
  });

  it("retries a concurrent database slug collision", async () => {
    const freshProfile = () => ({ userId: "u1", publicWorkUrl: "https://example.test", bio: "Engineer" });
    const tx = createEm({ findOne: vi.fn()
      .mockImplementation(async (_entity, where: Record<string, unknown>) => "userId" in where ? freshProfile() : null),
      flush: vi.fn().mockRejectedValueOnce(Object.assign(new Error("duplicate"), { code: "23505", constraint: "mentor_profiles_slug_unique" })).mockResolvedValue(undefined) });
    const em = createEm({ findOne: vi.fn().mockResolvedValue({ id: "u1", displayName: "Ada" }) });
    em.transactional.mockImplementation(async (run) => run(tx as never));
    await expect(createMentorRepository(asEm(em)).publishProfile("u1")).resolves.toMatchObject({ slug: "ada-2" });
    expect(tx.findOne).toHaveBeenCalledTimes(4);
    expect(tx.flush).toHaveBeenCalledTimes(2);
  });

  it("fails clearly when no unique slug is available", async () => {
    const profile = { userId: "u1", publicWorkUrl: "https://example.test", bio: "Engineer" };
    const tx = createEm({ findOne: vi.fn().mockImplementation(async (_entity, where: Record<string, unknown>) => "userId" in where ? profile : { id: "collision" }) });
    const em = createEm({ findOne: vi.fn().mockResolvedValue({ id: "u1", displayName: "Ada" }) });
    em.transactional.mockImplementation(async (run) => run(tx as never));
    await expect(createMentorRepository(asEm(em)).publishProfile("u1")).rejects.toMatchObject({ status: 409, message: "Could not allocate a unique mentor link; retry publication" });
    expect(tx.findOne).toHaveBeenCalledTimes(200);
  });

  it("lists mentors ordered by creation date", async () => {
    const mentors = [{ id: "1" }];
    const em = createEm({ find: vi.fn().mockResolvedValue(mentors) });
    await expect(createMentorRepository(asEm(em)).findAll()).resolves.toBe(mentors);
    expect(em.find).toHaveBeenCalledWith("Mentor", {}, { orderBy: { createdAt: "asc" } });
  });

  it("returns published profile allowlists and never includes private values", async () => {
    const em = createEm({ find: vi.fn()
      .mockResolvedValueOnce([
        { userId: "u1", slug: "ada", publishedAt: new Date(0), publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: ["TypeScript"], sessionChannel: "private" },
        { userId: "u2", slug: "grace", publishedAt: new Date(1), publicWorkUrl: "https://example.test/grace", bio: "Scientist", stackTags: [] },
        { userId: "u3", slug: "hidden", publishedAt: new Date(2), publicWorkUrl: null, bio: "No URL", stackTags: [], sessionChannel: "secret" },
      ])
      .mockResolvedValueOnce([{ id: "u1", displayName: "Ada", email: "ada@example.test" }, { id: "u2", displayName: null, email: "grace@example.test" }]) });
    const results = await createMentorRepository(asEm(em)).findPublishedProfiles();
    expect(results).toEqual([
      { slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: ["TypeScript"] },
      { slug: "grace", displayName: "Mentor", publicWorkUrl: "https://example.test/grace", bio: "Scientist", stackTags: [] },
    ]);
    expect(em.find).toHaveBeenNthCalledWith(1, "MentorProfile", { publishedAt: { $ne: null } }, { orderBy: { publishedAt: "desc" } });
    expect(em.find).toHaveBeenNthCalledWith(2, "User", { id: { $in: ["u1", "u2", "u3"] } });
    expect(JSON.stringify(results)).not.toContain("private");
    expect(JSON.stringify(results)).not.toContain("@example.test");
  });

  it("finds profiles by id for the downstream booking price lookup", async () => {
    const profile = { id: "profile-1", userId: "u1" };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(profile) });
    await expect(createMentorRepository(asEm(em)).findProfileById("profile-1")).resolves.toBe(profile);
    expect(em.findOne).toHaveBeenCalledWith("MentorProfile", { id: "profile-1" });
  });

  it("updates both prices together under a profile row lock", async () => {
    const profile = { id: "profile-1", userId: "u1", price25Cents: null, price50Cents: null };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(profile), flush: vi.fn().mockResolvedValue(undefined) });
    const result = await createMentorRepository(asEm(em)).updatePrices("u1", 1000, 18000);
    expect(result).toMatchObject({ price25Cents: 1000, price50Cents: 18000 });
    expect(em.findOne).toHaveBeenCalledWith("MentorProfile", { userId: "u1" }, { lockMode: 2 });
    expect(em.flush).toHaveBeenCalledOnce();
  });

  it("does not query users when no profile is published", async () => {
    const em = createEm({ find: vi.fn().mockResolvedValue([]) });
    await expect(createMentorRepository(asEm(em)).findPublishedProfiles()).resolves.toEqual([]);
    expect(em.find).toHaveBeenCalledTimes(1);
  });

  it("projects only allowlisted fields in the public mentor DTO", async () => {
    const profile = { id: "private-id", userId: "private-owner", initialPublishDueAt: new Date(), slug: "ada", publishedAt: new Date(), publicWorkUrl: "https://example.test", bio: "Builder", stackTags: ["TypeScript"], sessionChannel: "private room", price25Cents: null, price50Cents: null };
    const em = createEm({ findOne: vi.fn().mockResolvedValueOnce(profile).mockResolvedValueOnce({ id: "private-owner", displayName: "Ada" }) });
    const result = await createMentorRepository(asEm(em)).findPublicProfile("ada");
    expect(result).toEqual({ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Builder", stackTags: ["TypeScript"], sessionChannel: "private room", publishedAt: profile.publishedAt, price25Cents: null, price50Cents: null });
  });

  it("returns no public profile when unpublished or missing required fields and defaults the display name", async () => {
    const incomplete = { userId: "u1", slug: "ada", publishedAt: new Date(), publicWorkUrl: null, bio: "Engineer" };
    const missingUser = { userId: "u1", slug: "ada", publishedAt: new Date(), publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: null };
    const em = createEm({ findOne: vi.fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(incomplete)
      .mockResolvedValueOnce(missingUser)
      .mockResolvedValueOnce(null) });
    const repository = createMentorRepository(asEm(em));
    await expect(repository.findPublicProfile("missing")).resolves.toBeNull();
    await expect(repository.findPublicProfile("incomplete")).resolves.toBeNull();
    await expect(repository.findPublicProfile("ada")).resolves.toMatchObject({ displayName: "Mentor", stackTags: [], sessionChannel: null, price25Cents: null, price50Cents: null });
  });

  it("creates a mentor, stamping the creation date, and flushes", async () => {
    const created = { id: "1", name: "Ada", email: "ada@example.com" };
    const em = createEm({ create: vi.fn().mockReturnValue(created), flush: vi.fn().mockResolvedValue(undefined) });
    const result = await createMentorRepository(asEm(em)).create({ name: "Ada", email: "ada@example.com" });
    expect(result).toBe(created);
    expect(em.create).toHaveBeenCalledWith("Mentor", {
      name: "Ada",
      email: "ada@example.com",
      createdAt: expect.any(Date),
    });
    expect(em.flush).toHaveBeenCalledTimes(1);
  });

  it("rethrows a flush error without a database code unchanged", async () => {
    const failure = new Error("unexpected");
    const em = createEm({ create: vi.fn().mockReturnValue({}), flush: vi.fn().mockRejectedValue(failure) });
    await expect(createMentorRepository(asEm(em)).create({ name: "Ada", email: "a@b.co" })).rejects.toBe(failure);
  });

  it("translates a PostgreSQL unique violation into a domain error", async () => {
    const em = createEm({
      create: vi.fn().mockReturnValue({}),
      flush: vi.fn().mockRejectedValue(Object.assign(new Error("duplicate key"), { code: "23505" })),
    });
    const repository = createMentorRepository(asEm(em));
    const failure = repository.create({ name: "Ada", email: "ada@example.com" });
    await expect(failure).rejects.toBeInstanceOf(ConflictError);
    await expect(failure).rejects.toMatchObject({
      status: 409,
      message: "A mentor with email ada@example.com already exists",
    });
  });

  it("rethrows any other database error untouched", async () => {
    const failure = Object.assign(new Error("connection lost"), { code: "08006" });
    const em = createEm({ create: vi.fn().mockReturnValue({}), flush: vi.fn().mockRejectedValue(failure) });
    await expect(createMentorRepository(asEm(em)).create({ name: "Ada", email: "a@b.co" })).rejects.toBe(failure);
  });
});
