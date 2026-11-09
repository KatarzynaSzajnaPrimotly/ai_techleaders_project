import type { EntityManager } from "@mikro-orm/postgresql";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConflictError, type Invitation } from "@devmentor/core";
import { createInvitationRepository } from "./invitation.repository";

function createEntityManager(overrides: Record<string, unknown> = {}) {
  const user = {
    id: "user-1", email: "ada@example.test", emailVerifiedAt: new Date(1), passwordHash: null, displayName: "Ada",
    role: "mentee", roles: ["mentee"], sessionVersion: 0, githubId: null, githubLogin: null, avatarUrl: null,
    createdAt: new Date(1), updatedAt: new Date(1),
  };
  const invitation: Invitation = {
    id: "inv-1", email: "ada@example.test", tokenHash: "a".repeat(64), stackTags: ["TypeScript"], expiresAt: new Date(2),
    acceptedAt: null, acceptedById: null, publishDueAt: null, revokedAt: null, batch: null, createdAt: new Date(1), updatedAt: new Date(1),
  };
  const profile: { id: string; userId: string; initialPublishDueAt: Date | null; createdAt: Date; updatedAt: Date } = { id: "profile-1", userId: "user-1", initialPublishDueAt: null, createdAt: new Date(1), updatedAt: new Date(1) };
  const em = {
    transactional: vi.fn(async (run: (tx: typeof em) => Promise<unknown>) => run(em)),
    findOne: vi.fn(async (...args: [name: string, where?: unknown, options?: unknown]) => {
      const [name] = args;
      return name === "User" ? user : name === "Invitation" ? invitation : profile;
    }),
    create: vi.fn((_name: string, entity: object) => entity),
    flush: vi.fn(async () => undefined),
    ...overrides,
  };
  return { em: em as unknown as EntityManager, raw: em, user, invitation, profile };
}

afterEach(() => vi.restoreAllMocks());

describe("createInvitationRepository", () => {
  it("runs a transaction and locks the user before the invitation, then persists additive role changes", async () => {
    const { em, raw, user, invitation } = createEntityManager();
    const repository = createInvitationRepository(em);
    await repository.transaction(async (tx) => {
      expect(await tx.findUserByIdForUpdate("user-1")).toBe(user);
      expect(await tx.findUserByEmailForUpdate("ada@example.test")).toBe(user);
      expect(await tx.findInvitationByTokenHashForUpdate(invitation.tokenHash)).toBe(invitation);
      expect(await tx.findInvitationByIdForUpdate(invitation.id)).toBe(invitation);
      const created = await tx.createInvitation({ email: "ada@example.test", tokenHash: "b".repeat(64), stackTags: [], expiresAt: new Date(3), batch: null });
      expect(created.email).toBe("ada@example.test");
      await tx.saveInvitation(invitation);
      expect(await tx.grantMentorRole("user-1")).toBe(user);
      const profile = await tx.findMentorProfileForUpdate("user-1");
      expect(profile?.userId).toBe("user-1");
      await tx.createMentorProfile("user-1", new Date(4));
      await tx.saveMentorProfile(profile!);
    });
    expect(raw.transactional).toHaveBeenCalledOnce();
    expect(raw.findOne.mock.calls.slice(0, 4).map(([name, , options]) => [name, (options as { lockMode?: unknown } | undefined)?.lockMode])).toMatchObject([
      ["User", expect.anything()], ["User", expect.anything()], ["Invitation", expect.anything()], ["Invitation", expect.anything()],
    ]);
    expect(user.roles).toContain("mentor");
    expect(user.sessionVersion).toBe(1);
    expect(raw.flush).toHaveBeenCalled();
  });

  it("returns null when the locked user does not exist", async () => {
    const { em } = createEntityManager({ findOne: vi.fn(async () => null) });
    await expect(createInvitationRepository(em).transaction((tx) => tx.grantMentorRole("missing"))).resolves.toBeNull();
  });

  it("looks up public tokens and owner onboarding deadlines", async () => {
    const { em, invitation, profile } = createEntityManager();
    const repository = createInvitationRepository(em);
    await expect(repository.findByTokenHash(invitation.tokenHash)).resolves.toBe(invitation);
    await expect(repository.findInitialPublishDueAt("user-1")).resolves.toBeNull();
    profile.initialPublishDueAt = new Date(5);
    await expect(repository.findInitialPublishDueAt("user-1")).resolves.toEqual(new Date(5));
  });

  it("maps unresolved invitation uniqueness violations to ConflictError", async () => {
    const duplicate = Object.assign(new Error("unique index"), { code: "23505" });
    const { em } = createEntityManager({ transactional: vi.fn(async () => { throw duplicate; }) });
    await expect(createInvitationRepository(em).transaction(async () => "unused")).rejects.toBeInstanceOf(ConflictError);
  });

  it("preserves unrelated transaction errors", async () => {
    const failure = new Error("connection lost");
    const { em } = createEntityManager({ transactional: vi.fn(async () => { throw failure; }) });
    await expect(createInvitationRepository(em).transaction(async () => "unused")).rejects.toBe(failure);
  });
});
