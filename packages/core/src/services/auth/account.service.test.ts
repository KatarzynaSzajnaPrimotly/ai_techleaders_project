import { afterEach, describe, expect, it, vi } from "vitest";
import { ConflictError, ServiceUnavailableError } from "../../http/errors";
import type { GithubEmail, GithubIdentityPort, GithubUser } from "./github-identity.port";
import type { UserRepositoryPort } from "./user-repository.port";
import type { User } from "./user.types";
import { AccountService, NoVerifiedGithubEmailError } from "./account.service";

const githubUser: GithubUser = {
  id: "github-123",
  login: "ada",
  name: "Ada Lovelace",
  avatarUrl: "https://example.test/ada.png",
};
const githubEmails: GithubEmail[] = [
  { email: "ada+secondary@example.test", primary: false, verified: true, visibility: "private" },
  { email: "ada@example.test", primary: true, verified: true, visibility: "private" },
];

function user(overrides: Partial<User> = {}): User {
  const now = new Date("2026-10-27T00:00:00.000Z");
  return {
    id: "user-1",
    email: "ada@example.test",
    emailVerifiedAt: now,
    passwordHash: null,
    displayName: "Ada",
    role: "mentee",
    githubId: null,
    githubLogin: null,
    avatarUrl: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function setup() {
  const userRepository = {
    findById: vi.fn<UserRepositoryPort["findById"]>().mockResolvedValue(null),
    findByEmail: vi.fn<UserRepositoryPort["findByEmail"]>().mockResolvedValue(null),
    findByGithubId: vi.fn<UserRepositoryPort["findByGithubId"]>().mockResolvedValue(null),
    create: vi.fn<UserRepositoryPort["create"]>(),
    linkGithub: vi.fn<UserRepositoryPort["linkGithub"]>(),
    grantRole: vi.fn<UserRepositoryPort["grantRole"]>(),
  } satisfies UserRepositoryPort;
  const githubIdentity = {
    getUser: vi.fn<GithubIdentityPort["getUser"]>().mockResolvedValue(githubUser),
    getEmails: vi.fn<GithubIdentityPort["getEmails"]>().mockResolvedValue(githubEmails),
    createAuthorizationUrl: vi.fn<GithubIdentityPort["createAuthorizationUrl"]>(),
    exchangeCode: vi.fn<GithubIdentityPort["exchangeCode"]>(),
  } satisfies GithubIdentityPort;
  return {
    service: new AccountService({ userRepository, githubIdentity }),
    userRepository,
    githubIdentity,
  };
}

afterEach(() => vi.restoreAllMocks());

describe("AccountService.findOrCreateFromGithub", () => {
  it("returns an account matched by GitHub id before looking up e-mail addresses", async () => {
    const existing = user({ githubId: githubUser.id });
    const { service, userRepository, githubIdentity } = setup();
    userRepository.findByGithubId.mockResolvedValue(existing);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toBe(existing);

    expect(githubIdentity.getUser).toHaveBeenCalledWith("access-token");
    expect(userRepository.findByGithubId).toHaveBeenCalledWith(githubUser.id);
    expect(githubIdentity.getEmails).not.toHaveBeenCalled();
  });

  it("requires the verified primary e-mail and refuses a verified non-primary address", async () => {
    const { service, userRepository, githubIdentity } = setup();
    githubIdentity.getEmails.mockResolvedValue([
      { email: "verified@example.test", primary: false, verified: true, visibility: "private" },
      { email: "primary@example.test", primary: true, verified: false, visibility: "private" },
    ]);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBeInstanceOf(NoVerifiedGithubEmailError);
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("refuses a verified primary entry whose e-mail is empty after trimming", async () => {
    const { service, userRepository, githubIdentity } = setup();
    githubIdentity.getEmails.mockResolvedValue([
      { email: "  ", primary: true, verified: true, visibility: null },
    ]);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBeInstanceOf(NoVerifiedGithubEmailError);
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it("links a verified primary e-mail to an existing account with no GitHub id", async () => {
    const existing = user({ role: "mentor", email: "ada@example.test" });
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(existing);
    userRepository.linkGithub.mockResolvedValue(true);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toEqual({ ...existing, githubId: githubUser.id });
    expect(userRepository.findByEmail).toHaveBeenCalledWith("ada@example.test");
    expect(userRepository.linkGithub).toHaveBeenCalledWith(existing.id, githubUser.id);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("returns an e-mail match already linked to the same GitHub id after a concurrent lookup", async () => {
    const existing = user({ githubId: githubUser.id });
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(existing);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toBe(existing);
    expect(userRepository.linkGithub).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("refuses to link an e-mail account already linked to a different GitHub id", async () => {
    const existing = user({ githubId: "github-other" });
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(existing);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toMatchObject({
      name: "ConflictError",
      message: "This e-mail is already linked to another GitHub account",
    });
    expect(userRepository.linkGithub).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("retries the GitHub-id lookup when a conditional link loses to the same identity", async () => {
    const existing = user();
    const winner = user({ id: "winner", githubId: githubUser.id });
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(existing);
    userRepository.findByGithubId.mockResolvedValueOnce(null).mockResolvedValueOnce(winner);
    userRepository.linkGithub.mockResolvedValue(false);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toBe(winner);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("refuses a conditional link lost to a different GitHub identity", async () => {
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(user());
    userRepository.linkGithub.mockResolvedValue(false);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toMatchObject({
      name: "ConflictError",
      message: "This account cannot be linked to GitHub",
    });
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
  });

  it("retries after a unique collision while linking and returns the winning account", async () => {
    const winner = user({ id: "winner", githubId: githubUser.id });
    const conflict = new ConflictError();
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(user());
    userRepository.findByGithubId.mockResolvedValueOnce(null).mockResolvedValueOnce(winner);
    userRepository.linkGithub.mockRejectedValue(conflict);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toBe(winner);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
  });

  it("keeps a unique link collision when the winning GitHub account is not visible", async () => {
    const conflict = new ConflictError();
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(user());
    userRepository.linkGithub.mockRejectedValue(conflict);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBe(conflict);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
  });

  it("rethrows a link error other than a unique conflict without retrying", async () => {
    const failure = new ServiceUnavailableError("Database temporarily unavailable");
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(user());
    userRepository.linkGithub.mockRejectedValue(failure);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBe(failure);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(1);
  });

  it("creates a mentee from the verified primary e-mail and GitHub profile", async () => {
    const created = user({
      githubId: githubUser.id,
      githubLogin: githubUser.login,
      avatarUrl: githubUser.avatarUrl,
    });
    const { service, userRepository } = setup();
    userRepository.create.mockResolvedValue(created);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toBe(created);

    expect(userRepository.create).toHaveBeenCalledWith({
      email: "ada@example.test",
      emailVerifiedAt: expect.any(Date),
      displayName: githubUser.name,
      role: "mentee",
      githubId: githubUser.id,
      githubLogin: githubUser.login,
      avatarUrl: githubUser.avatarUrl,
    });
    expect(userRepository.create.mock.calls[0]?.[0].emailVerifiedAt.getTime()).toBeGreaterThan(0);
  });

  it("returns the winning account after a unique first-sign-in race", async () => {
    const winner = user({ id: "winner", githubId: githubUser.id });
    const conflict = new ConflictError();
    const { service, userRepository } = setup();
    userRepository.create.mockRejectedValue(conflict);
    userRepository.findByGithubId.mockResolvedValueOnce(null).mockResolvedValueOnce(winner);

    await expect(service.findOrCreateFromGithub("access-token")).resolves.toBe(winner);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
  });

  it("rethrows a create error other than a unique conflict without retrying", async () => {
    const failure = new ServiceUnavailableError("Database temporarily unavailable");
    const { service, userRepository } = setup();
    userRepository.create.mockRejectedValue(failure);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBe(failure);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(1);
  });

  it("keeps a unique collision when the winning GitHub account is not visible", async () => {
    const conflict = new ConflictError();
    const { service, userRepository } = setup();
    userRepository.create.mockRejectedValue(conflict);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBe(conflict);
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
  });

  it("propagates errors from GitHub without reading user data", async () => {
    const failure = new ServiceUnavailableError("GitHub authentication is temporarily unavailable");
    const { service, githubIdentity, userRepository } = setup();
    githubIdentity.getUser.mockRejectedValue(failure);

    await expect(service.findOrCreateFromGithub("access-token")).rejects.toBe(failure);
    expect(githubIdentity.getEmails).not.toHaveBeenCalled();
    expect(userRepository.findByGithubId).not.toHaveBeenCalled();
  });
});

describe("AccountService password account lookups", () => {
  it("returns only the display name and GitHub login for a role home", async () => {
    const existing = user({ passwordHash: "$2b$12$sensitive", githubLogin: "ada-lovelace" });
    const { service, userRepository } = setup();
    userRepository.findById.mockResolvedValue(existing);

    await expect(service.findForRoleHome(existing.id)).resolves.toEqual({ displayName: "Ada", githubLogin: "ada-lovelace" });
    expect(userRepository.findById).toHaveBeenCalledWith(existing.id);
  });

  it("returns null when a role home account lookup misses", async () => {
    const { service, userRepository } = setup();
    userRepository.findById.mockResolvedValue(null);
    await expect(service.findForRoleHome("missing")).resolves.toBeNull();
  });

  it("returns an allowlisted e-mail lookup without the password hash", async () => {
    const existing = user({ passwordHash: "$2b$12$sensitive" });
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(existing);

    await expect(service.findByEmail(existing.email)).resolves.toEqual({
      id: existing.id,
      email: existing.email,
      githubId: existing.githubId,
    });
  });

  it("returns null for an e-mail lookup miss", async () => {
    const { service } = setup();
    await expect(service.findByEmail("missing@example.test")).resolves.toBeNull();
  });

  it("creates a mentee password account and returns no credential fields", async () => {
    const created = user({ passwordHash: "$2b$12$sensitive" });
    const { service, userRepository } = setup();
    userRepository.create.mockResolvedValue(created);

    await expect(service.createPasswordAccount({
      email: created.email,
      emailVerifiedAt: created.emailVerifiedAt,
      displayName: created.displayName ?? "Ada",
      passwordHash: created.passwordHash ?? "hash",
    })).resolves.toEqual({ id: created.id, role: created.role });
    expect(userRepository.create).toHaveBeenCalledWith({
      email: created.email,
      emailVerifiedAt: created.emailVerifiedAt,
      displayName: created.displayName ?? "Ada",
      passwordHash: created.passwordHash ?? "hash",
      role: "mentee",
    });
  });

  it("returns only the login fields required by password authentication", async () => {
    const existing = user({ passwordHash: "$2b$12$sensitive" });
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue(existing);

    await expect(service.findForLogin(existing.email)).resolves.toEqual({
      id: existing.id,
      role: existing.role,
      passwordHash: existing.passwordHash,
    });
  });

  it("returns null for a password login lookup miss", async () => {
    const { service } = setup();
    await expect(service.findForLogin("missing@example.test")).resolves.toBeNull();
  });
});
