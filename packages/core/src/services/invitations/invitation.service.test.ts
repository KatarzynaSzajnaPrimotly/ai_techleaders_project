import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../../http/errors";
import type { Invitation } from "./invitation.types";
import type { InvitationRepositoryPort, InvitationTransactionPort } from "./invitation-repository.port";
import { hashToken } from "./token.service";
import { InvitationService, INVITATION_INVALID_MESSAGE } from "./invitation.service";

const NOW = new Date("2026-11-09T12:00:00.000Z");
const TOKEN = "a-token-used-only-by-this-test";

function makeInvitation(overrides: Partial<Invitation> = {}): Invitation {
  return {
    id: "inv-1",
    email: "ada@example.test",
    tokenHash: hashToken(TOKEN),
    stackTags: ["TypeScript"],
    expiresAt: new Date("2026-11-23T12:00:00.000Z"),
    acceptedAt: null,
    acceptedById: null,
    publishDueAt: null,
    revokedAt: null,
    batch: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function makeHarness(options: { invitation?: Invitation | null; email?: string; role?: "mentee" | "mentor"; roles?: ("mentee" | "mentor")[]; emailVerifiedAt?: Date | null; profileDue?: Date | null } = {}) {
  const state = {
    invitation: options.invitation === undefined ? makeInvitation() : options.invitation,
    user: {
      id: "user-1",
      email: options.email ?? "ada@example.test",
      emailVerifiedAt: options.emailVerifiedAt === undefined ? new Date("2026-01-01T00:00:00Z") : options.emailVerifiedAt,
      passwordHash: null,
      displayName: "Ada",
      role: options.role ?? "mentee" as const,
      roles: options.roles ?? [options.role ?? "mentee" as const],
      sessionVersion: 2,
      githubId: null,
      githubLogin: null,
      avatarUrl: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    profile: options.profileDue === undefined ? null : { id: "profile-1", userId: "user-1", initialPublishDueAt: options.profileDue, createdAt: NOW, updatedAt: NOW },
    order: [] as string[],
  };
  const tx: InvitationTransactionPort = {
    findUserByIdForUpdate: vi.fn(async () => { state.order.push("user"); return state.user; }),
    findUserByEmailForUpdate: vi.fn(async (email) => email === state.user.email ? state.user : null),
    findInvitationByTokenHashForUpdate: vi.fn(async (tokenHash) => {
      state.order.push("invitation");
      return state.invitation?.tokenHash === tokenHash ? state.invitation : null;
    }),
    findInvitationByIdForUpdate: vi.fn(async (id) => id === state.invitation?.id ? state.invitation : null),
    createInvitation: vi.fn(async (input) => {
      state.invitation = makeInvitation({ ...input, id: "inv-new", createdAt: NOW, updatedAt: NOW });
      return state.invitation;
    }),
    saveInvitation: vi.fn(async (invitation) => { state.invitation = invitation; }),
    grantMentorRole: vi.fn(async () => {
      if (!state.user.roles.includes("mentor")) {
        state.user.roles.push("mentor");
        state.user.sessionVersion += 1;
      }
      return state.user;
    }),
    findMentorProfileForUpdate: vi.fn(async () => state.profile),
    createMentorProfile: vi.fn(async (userId, initialPublishDueAt) => {
      state.profile = { id: "profile-1", userId, initialPublishDueAt, createdAt: NOW, updatedAt: NOW };
      return state.profile;
    }),
    saveMentorProfile: vi.fn(async (profile) => { state.profile = profile; }),
  };
  const repository: InvitationRepositoryPort = {
    transaction: vi.fn(async (run) => run(tx)),
    findByTokenHash: vi.fn(async (tokenHash) => state.invitation?.tokenHash === tokenHash ? state.invitation : null),
    findInitialPublishDueAt: vi.fn(async (userId) => userId === state.profile?.userId ? state.profile?.initialPublishDueAt ?? null : null),
  };
  const invitationEvents = { publishInvitationAccepted: vi.fn(async () => undefined) };
  const service = new InvitationService({ invitationRepository: repository, invitationEvents, now: () => new Date(NOW) });
  return { service, repository, tx, invitationEvents, state };
}

describe("InvitationService", () => {
  beforeEach(() => vi.stubEnv("OPERATOR_EMAILS", ""));

  it("creates a normalized invitation, snapshots its expiry, and returns the raw token once", async () => {
    const { service, tx } = makeHarness({ invitation: null });
    const result = await service.create({ email: " Ada@Example.Test ", stackTags: ["React", "React"], batch: " November " });
    expect(result.invitation).toMatchObject({ email: "ada@example.test", stackTags: ["React"], batch: "November", expiresAt: new Date("2026-11-23T12:00:00.000Z") });
    expect(result.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(result.invitation.tokenHash).toBe(hashToken(result.token));
    expect(tx.createInvitation).toHaveBeenCalledOnce();
  });

  it("creates an invitation without an optional batch", async () => {
    const { service, tx } = makeHarness({ invitation: null });
    await service.create({ email: "ada@example.test", stackTags: [] });
    expect(tx.createInvitation).toHaveBeenCalledWith(expect.objectContaining({ batch: null }));
  });

  it("uses its default clock when none is injected", async () => {
    const { repository, invitationEvents } = makeHarness();
    const defaultClockService = new InvitationService({ invitationRepository: repository, invitationEvents });
    await expect(defaultClockService.lookup(TOKEN)).resolves.toHaveProperty("email", "ada@example.test");
  });

  it.each([
    ["malformed e-mail", { email: "not an email", stackTags: [] }],
    ["too many stack tags", { email: "ada@example.test", stackTags: ["TypeScript", "React", "Python", "AI agents", "React"] }],
    ["unknown stack tag", { email: "ada@example.test", stackTags: ["Ruby"] }],
  ])("rejects %s at invitation creation", async (_label, input) => {
    const { service } = makeHarness({ invitation: null });
    await expect(service.create(input)).rejects.toBeInstanceOf(ValidationError);
  });

  it("refuses invitations for current mentors and configured operators", async () => {
    await expect(makeHarness({ role: "mentor", roles: ["mentee", "mentor"], invitation: null }).service.create({ email: "ada@example.test", stackTags: [] })).rejects.toBeInstanceOf(ConflictError);
    vi.stubEnv("OPERATOR_EMAILS", "ada@example.test");
    await expect(makeHarness({ invitation: null }).service.create({ email: "ada@example.test", stackTags: [] })).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("looks up only active invitations and returns a token-free public projection", async () => {
    const { service } = makeHarness();
    const result = await service.lookup(TOKEN);
    expect(result).toEqual({ email: "ada@example.test", stackTags: ["TypeScript"], expiresAt: new Date("2026-11-23T12:00:00.000Z") });
    expect(result).not.toHaveProperty("tokenHash");
  });

  it.each([
    ["unknown", null],
    ["expired", makeInvitation({ expiresAt: new Date("2026-11-09T11:59:59.999Z") })],
    ["revoked", makeInvitation({ revokedAt: NOW })],
    ["accepted", makeInvitation({ acceptedAt: NOW, acceptedById: "user-1" })],
  ])("returns the same invalid result for %s links", async (_label, invitation) => {
    const { service } = makeHarness({ invitation });
    await expect(service.lookup(TOKEN)).rejects.toMatchObject({ status: 404, message: INVITATION_INVALID_MESSAGE });
  });

  it("accepts once, grants mentor additively, locks user before invitation, and snapshots the first profile deadline", async () => {
    const { service, tx, state, invitationEvents } = makeHarness();
    const accepted = await service.accept(TOKEN, "user-1");
    expect(state.order).toEqual(["user", "invitation"]);
    expect(accepted.roles).toEqual(["mentee", "mentor"]);
    expect(accepted.user.sessionVersion).toBe(3);
    expect(accepted.publishDueAt).toEqual(new Date("2026-11-23T12:00:00.000Z"));
    expect(state.profile?.initialPublishDueAt).toEqual(accepted.publishDueAt);
    expect(state.invitation).toMatchObject({ acceptedAt: NOW, acceptedById: "user-1", publishDueAt: accepted.publishDueAt });
    expect(invitationEvents.publishInvitationAccepted).toHaveBeenCalledWith({
      type: "invitations.invitation.accepted",
      invitationId: "inv-1",
      userId: "user-1",
      publishDueAt: accepted.publishDueAt,
    });
    await expect(service.accept(TOKEN, "user-1")).rejects.toBeInstanceOf(NotFoundError);
    expect(tx.grantMentorRole).toHaveBeenCalledOnce();
  });

  it("keeps a committed acceptance when an informational event subscriber fails", async () => {
    const { service, state, invitationEvents } = makeHarness();
    invitationEvents.publishInvitationAccepted.mockRejectedValue(new Error("subscriber failed"));
    await expect(service.accept(TOKEN, "user-1")).resolves.toMatchObject({ roles: ["mentee", "mentor"] });
    expect(state.invitation?.acceptedAt).toEqual(NOW);
  });

  it("rejects mismatched or unverified persisted e-mail without mutating the invitation", async () => {
    for (const options of [{ email: "other@example.test" }, { emailVerifiedAt: null }]) {
      const { service, tx, state } = makeHarness(options);
      await expect(service.accept(TOKEN, "user-1")).rejects.toBeInstanceOf(ForbiddenError);
      expect(state.invitation?.acceptedAt).toBeNull();
      expect(tx.grantMentorRole).not.toHaveBeenCalled();
      expect(tx.createMentorProfile).not.toHaveBeenCalled();
    }
  });

  it("rejects an allowlisted operator account before accepting", async () => {
    vi.stubEnv("OPERATOR_EMAILS", "ADA@example.test");
    const { service, state, tx } = makeHarness();
    await expect(service.accept(TOKEN, "user-1")).rejects.toBeInstanceOf(ForbiddenError);
    expect(state.invitation?.acceptedAt).toBeNull();
    expect(tx.grantMentorRole).not.toHaveBeenCalled();
  });

  it("fails closed when the locked user disappears before the role grant", async () => {
    const { service, tx } = makeHarness();
    vi.spyOn(tx, "grantMentorRole").mockResolvedValueOnce(null);
    await expect(service.accept(TOKEN, "user-1")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns not found when the account is already absent at the first lock", async () => {
    const { service, tx } = makeHarness();
    vi.spyOn(tx, "findUserByIdForUpdate").mockResolvedValueOnce(null);
    await expect(service.accept(TOKEN, "missing-user")).rejects.toBeInstanceOf(NotFoundError);
    expect(tx.findInvitationByTokenHashForUpdate).not.toHaveBeenCalled();
  });

  it("falls back to the legacy role field when a grant result has no role array", async () => {
    const { service, tx } = makeHarness();
    vi.spyOn(tx, "grantMentorRole").mockResolvedValueOnce({ ...makeHarness().state.user, roles: undefined });
    await expect(service.accept(TOKEN, "user-1")).resolves.toMatchObject({ roles: ["mentee", "mentor"] });
  });

  it("preserves an existing first deadline, including filling a legacy null once", async () => {
    const existingDue = new Date("2026-12-01T00:00:00Z");
    const existing = makeHarness({ profileDue: existingDue });
    await existing.service.accept(TOKEN, "user-1");
    expect(existing.state.profile?.initialPublishDueAt).toEqual(existingDue);
    expect(existing.tx.saveMentorProfile).not.toHaveBeenCalled();

    const empty = makeHarness({ profileDue: null });
    await empty.service.accept(TOKEN, "user-1");
    expect(empty.state.profile?.initialPublishDueAt).toEqual(new Date("2026-11-23T12:00:00.000Z"));
    expect(empty.tx.saveMentorProfile).toHaveBeenCalledOnce();
  });

  it("does not bump the session version when an existing mentor accepts another historical invite", async () => {
    const { service, state } = makeHarness({ role: "mentor", roles: ["mentee", "mentor"] });
    await service.accept(TOKEN, "user-1");
    expect(state.user.sessionVersion).toBe(2);
  });

  it("revokes pending invitations and rejects missing, accepted, or already revoked rows", async () => {
    const { service, state } = makeHarness();
    await service.revoke("inv-1");
    expect(state.invitation?.revokedAt).toEqual(NOW);
    await expect(service.revoke("missing")).rejects.toBeInstanceOf(NotFoundError);
    await expect(makeHarness({ invitation: makeInvitation({ acceptedAt: NOW, acceptedById: "user-1" }) }).service.revoke("inv-1")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("resends expired unresolved invitations with a new hash and expiry, invalidating the old link", async () => {
    const { service, state } = makeHarness({ invitation: makeInvitation({ expiresAt: new Date("2026-10-01T00:00:00Z") }) });
    const result = await service.resend("inv-1");
    expect(result.token).not.toBe(TOKEN);
    expect(result.invitation.tokenHash).toBe(hashToken(result.token));
    expect(result.invitation.expiresAt).toEqual(new Date("2026-11-23T12:00:00.000Z"));
    expect(state.invitation?.tokenHash).not.toBe(hashToken(TOKEN));
    await expect(service.lookup(TOKEN)).rejects.toBeInstanceOf(NotFoundError);
    await expect(makeHarness({ invitation: makeInvitation({ acceptedAt: NOW, acceptedById: "user-1" }) }).service.resend("inv-1")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("reads the owner's durable onboarding deadline", async () => {
    const { service } = makeHarness({ profileDue: NOW });
    await expect(service.onboardingStatus("user-1")).resolves.toEqual({ initialPublishDueAt: NOW });
    await expect(makeHarness().service.onboardingStatus("user-1")).resolves.toEqual({ initialPublishDueAt: null });
  });
});
