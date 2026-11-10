import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "@devmentor/core";
import { createMentorRepository } from "./mentor.repository";

function createEm(overrides: Record<string, unknown> = {}) {
  return {
    find: vi.fn(),
    create: vi.fn(),
    flush: vi.fn(),
    findOne: vi.fn(),
    ...overrides,
  };
}

const asEm = (em: ReturnType<typeof createEm>) => em as unknown as Parameters<typeof createMentorRepository>[0];

describe("createMentorRepository", () => {
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

  it("does not query users when no profile is published", async () => {
    const em = createEm({ find: vi.fn().mockResolvedValue([]) });
    await expect(createMentorRepository(asEm(em)).findPublishedProfiles()).resolves.toEqual([]);
    expect(em.find).toHaveBeenCalledTimes(1);
  });

  it("projects only allowlisted fields in the public mentor DTO", async () => {
    const profile = { id: "private-id", userId: "private-owner", initialPublishDueAt: new Date(), slug: "ada", publishedAt: new Date(), publicWorkUrl: "https://example.test", bio: "Builder", stackTags: ["TypeScript"] };
    const em = createEm({ findOne: vi.fn().mockResolvedValueOnce(profile).mockResolvedValueOnce({ id: "private-owner", displayName: "Ada" }) });
    const result = await createMentorRepository(asEm(em)).findPublicProfile("ada");
    expect(result).toEqual({ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Builder", stackTags: ["TypeScript"] });
    expect(Object.keys(result ?? {}).sort()).toEqual(["bio", "displayName", "publicWorkUrl", "slug", "stackTags"]);
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
