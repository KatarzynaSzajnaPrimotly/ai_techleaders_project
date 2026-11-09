import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "@devmentor/core";
import { createUserRepository } from "./user.repository";

function createEm(overrides: Record<string, unknown> = {}) {
  return {
    findOne: vi.fn(),
    create: vi.fn(),
    flush: vi.fn(),
    nativeUpdate: vi.fn(),
    ...overrides,
  };
}

const asEm = (em: ReturnType<typeof createEm>) => em as unknown as Parameters<typeof createUserRepository>[0];

describe("createUserRepository", () => {
  it("finds a user by id", async () => {
    const user = { id: "u-1" };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(user) });
    await expect(createUserRepository(asEm(em)).findById("u-1")).resolves.toBe(user);
    expect(em.findOne).toHaveBeenCalledWith("User", { id: "u-1" });
  });

  it("finds users by normalized e-mail", async () => {
    const user = { id: "u-1" };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(user) });
    await expect(createUserRepository(asEm(em)).findByEmail(" ADA@Example.COM ")).resolves.toBe(user);
    expect(em.findOne).toHaveBeenCalledWith("User", { email: "ada@example.com" });
  });

  it("finds users by GitHub identity", async () => {
    const user = { id: "u-1" };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(user) });
    await expect(createUserRepository(asEm(em)).findByGithubId("1234")).resolves.toBe(user);
    expect(em.findOne).toHaveBeenCalledWith("User", { githubId: "1234" });
  });

  it("creates a user with a lowercase e-mail, defaults, and timestamps", async () => {
    const user = { id: "u-1" };
    const em = createEm({ create: vi.fn().mockReturnValue(user), flush: vi.fn().mockResolvedValue(undefined) });
    await expect(createUserRepository(asEm(em)).create({
      email: " ADA@Example.COM ",
      emailVerifiedAt: new Date(10),
    })).resolves.toBe(user);
    expect(em.create).toHaveBeenCalledWith("User", {
      email: "ada@example.com",
      emailVerifiedAt: new Date(10),
      passwordHash: null,
      role: "mentee",
      sessionVersion: 0,
      displayName: null,
      githubId: null,
      githubLogin: null,
      avatarUrl: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(em.flush).toHaveBeenCalledOnce();
  });

  it("persists an explicit password hash without transforming it", async () => {
    const user = { id: "u-password" };
    const em = createEm({ create: vi.fn().mockReturnValue(user), flush: vi.fn().mockResolvedValue(undefined) });
    await createUserRepository(asEm(em)).create({
      email: "ada@example.test",
      emailVerifiedAt: new Date(10),
      passwordHash: "$2b$12$hash-value",
    });
    expect(em.create).toHaveBeenCalledWith("User", expect.objectContaining({ passwordHash: "$2b$12$hash-value" }));
  });

  it("keeps supplied role and optional profile values when creating a user", async () => {
    const user = { id: "u-2" };
    const em = createEm({ create: vi.fn().mockReturnValue(user), flush: vi.fn().mockResolvedValue(undefined) });
    await expect(createUserRepository(asEm(em)).create({
      email: "mentor@example.test",
      emailVerifiedAt: new Date(20),
      role: "mentor",
      passwordHash: null,
      displayName: "Mentor",
      githubId: "1234",
      githubLogin: "mentor",
      avatarUrl: "https://example.test/mentor.png",
    })).resolves.toBe(user);
    expect(em.create).toHaveBeenCalledWith("User", expect.objectContaining({
      role: "mentor",
      passwordHash: null,
      displayName: "Mentor",
      githubId: "1234",
      githubLogin: "mentor",
      avatarUrl: "https://example.test/mentor.png",
    }));
  });

  it("maps duplicate e-mail or GitHub identity to a generic conflict", async () => {
    const duplicate = Object.assign(new Error("database detail"), { code: "23505" });
    const em = createEm({ create: vi.fn().mockReturnValue({}), flush: vi.fn().mockRejectedValue(duplicate) });
    await expect(createUserRepository(asEm(em)).create({
      email: "ada@example.test",
      emailVerifiedAt: new Date(0),
    })).rejects.toMatchObject({
      name: "ConflictError",
      code: "CONFLICT",
      message: "A user with this e-mail or GitHub identity already exists",
    });
  });

  it.each([Object.assign(new Error("other driver error"), { code: "08006" }), new Error("unknown"), null])(
    "rethrows a non-unique flush error unchanged (%s)", async (failure) => {
      const em = createEm({ create: vi.fn().mockReturnValue({}), flush: vi.fn().mockRejectedValue(failure) });
      await expect(createUserRepository(asEm(em)).create({
        email: "ada@example.test",
        emailVerifiedAt: new Date(0),
      })).rejects.toBe(failure);
    },
  );

  it("links a GitHub identity only while the user has none and reports whether a row changed", async () => {
    const em = createEm({ nativeUpdate: vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0) });
    const repository = createUserRepository(asEm(em));
    await expect(repository.linkGithub("u-1", "1234")).resolves.toBe(true);
    await expect(repository.linkGithub("u-1", "5678")).resolves.toBe(false);
    expect(em.nativeUpdate).toHaveBeenNthCalledWith(1, "User", { id: "u-1", githubId: null }, {
      githubId: "1234",
      updatedAt: expect.any(Date),
    });
  });

  it("maps a GitHub link collision to ConflictError and rethrows other link failures", async () => {
    const duplicate = Object.assign(new Error("driver detail"), { code: "23505" });
    const connectionFailure = Object.assign(new Error("connection lost"), { code: "08006" });
    const em = createEm({ nativeUpdate: vi.fn().mockRejectedValueOnce(duplicate).mockRejectedValueOnce(connectionFailure) });
    const repository = createUserRepository(asEm(em));
    await expect(repository.linkGithub("u-1", "1234")).rejects.toBeInstanceOf(ConflictError);
    await expect(repository.linkGithub("u-1", "5678")).rejects.toBe(connectionFailure);
  });

  it("grants a stored role and reports whether the user exists", async () => {
    const user = { id: "u-1", role: "mentee", sessionVersion: 0, updatedAt: new Date(0) };
    const em = createEm({ findOne: vi.fn().mockResolvedValueOnce(user).mockResolvedValueOnce(null), flush: vi.fn() });
    const repository = createUserRepository(asEm(em));
    await expect(repository.grantRole("u-1", "mentor")).resolves.toBe(true);
    await expect(repository.grantRole("unknown", "mentee")).resolves.toBe(false);
    expect(user).toMatchObject({ role: "mentor", sessionVersion: 1 });
    expect(em.flush).toHaveBeenCalledOnce();
  });

  it("does not invalidate sessions when the stored role is unchanged", async () => {
    const user = { id: "u-1", role: "mentor", sessionVersion: 2, updatedAt: new Date(0) };
    const em = createEm({ findOne: vi.fn().mockResolvedValue(user), flush: vi.fn() });
    await expect(createUserRepository(asEm(em)).grantRole("u-1", "mentor")).resolves.toBe(true);
    expect(user.sessionVersion).toBe(2);
    expect(em.flush).not.toHaveBeenCalled();
  });
});
