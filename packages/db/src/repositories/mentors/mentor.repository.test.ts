import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "@devmentor/core";
import { createMentorRepository } from "./mentor.repository";

function createEm(overrides: Record<string, unknown> = {}) {
  return {
    find: vi.fn(),
    create: vi.fn(),
    flush: vi.fn(),
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
