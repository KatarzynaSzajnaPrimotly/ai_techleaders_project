import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountService, MentorService, PasswordAuthService, ServiceUnavailableError, UnauthorizedError, ValidationError } from "@devmentor/core";

const mocks = vi.hoisted(() => ({
  createOrm: vi.fn(),
  createMentorRepository: vi.fn(),
  createUserRepository: vi.fn(),
}));

vi.mock("@devmentor/db", () => ({
  createOrm: mocks.createOrm,
  createMentorRepository: mocks.createMentorRepository,
  createUserRepository: mocks.createUserRepository,
}));

import { createRequestScope, withScope } from "./container";

const globalForContainer = globalThis as unknown as { devmentorContainer?: unknown };

function createFakeOrm() {
  const fork = vi.fn(() => ({ forked: true }));
  return { orm: { em: { fork } }, fork };
}

beforeEach(() => {
  delete globalForContainer.devmentorContainer;
  mocks.createOrm.mockReset();
  mocks.createMentorRepository.mockReset();
  mocks.createUserRepository.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

describe("createRequestScope", () => {
  it("builds the root container once and reuses it for later scopes", async () => {
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);

    const first = await createRequestScope();
    const second = await createRequestScope();

    expect(mocks.createOrm).toHaveBeenCalledTimes(1);
    expect(first).not.toBe(second);
    expect(first.cradle.orm).toBe(orm);
    expect(second.cradle.orm).toBe(orm);
  });

  it("resolves a fresh entity manager fork per scope", async () => {
    const { orm, fork } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);

    const scope = await createRequestScope();
    const em = scope.cradle.em;

    expect(em).toEqual({ forked: true });
    expect(scope.cradle.em).toBe(em);
    await createRequestScope().then((other) => other.cradle.em);
    expect(fork).toHaveBeenCalledTimes(2);
  });

  it("wires the repository to the scoped entity manager and the service to the repository", async () => {
    const { orm } = createFakeOrm();
    const repository = { findAll: vi.fn().mockResolvedValue([]), create: vi.fn() };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createMentorRepository.mockReturnValue(repository);

    const scope = await createRequestScope();

    expect(scope.cradle.mentorRepository).toBe(repository);
    expect(mocks.createMentorRepository).toHaveBeenCalledWith(scope.cradle.em);
    expect(scope.cradle.mentorService).toBeInstanceOf(MentorService);
    await expect(scope.cradle.mentorService.list()).resolves.toEqual([]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it("registers the auth repository, GitHub adapter, and account service in the request scope", async () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "test-client");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "test-secret");
    vi.stubEnv("MAILER_TRANSPORT", "log");
    const { orm } = createFakeOrm();
    const userRepository = {
      findByEmail: vi.fn(),
      findByGithubId: vi.fn(),
      create: vi.fn(),
      linkGithub: vi.fn(),
      grantRole: vi.fn(),
    };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createUserRepository.mockReturnValue(userRepository);

    const scope = await createRequestScope();

    expect(scope.cradle.userRepository).toBe(userRepository);
    expect(mocks.createUserRepository).toHaveBeenCalledWith(scope.cradle.em);
    expect(scope.cradle.githubIdentity).toMatchObject({
      createAuthorizationUrl: expect.any(Function),
      exchangeCode: expect.any(Function),
      getUser: expect.any(Function),
      getEmails: expect.any(Function),
    });
    expect(scope.cradle.githubIdentity.createAuthorizationUrl("state", "https://devmentor.example/callback")).toContain("client_id=test-client");
    await expect(scope.cradle.githubIdentity.exchangeCode("", "https://devmentor.example/callback")).rejects.toBeInstanceOf(ValidationError);
    await expect(scope.cradle.githubIdentity.getUser("")).rejects.toBeInstanceOf(ValidationError);
    await expect(scope.cradle.githubIdentity.getEmails("")).rejects.toBeInstanceOf(ValidationError);
    expect(scope.cradle.accountService).toBeInstanceOf(AccountService);
    expect(scope.cradle.passwordAuthService).toBeInstanceOf(PasswordAuthService);
    expect(scope.cradle.passwordHasher).toMatchObject({ hash: expect.any(Function), compare: expect.any(Function) });
  });

  it("registers the in-memory rate limiter and selects the log mailer only explicitly", async () => {
    vi.stubEnv("MAILER_TRANSPORT", "log");
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    const scope = await createRequestScope();
    expect(scope.cradle.rateLimiter).toMatchObject({ hit: expect.any(Function) });
    expect(scope.cradle.mailer).toMatchObject({ send: expect.any(Function) });
  });

  it("allows login services to resolve without mail config but fails closed when mail is sent", async () => {
    delete process.env.MAILER_TRANSPORT;
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;
    vi.stubEnv("JWT_SECRET", "container-test-secret-long-enough-for-hs256");
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createUserRepository.mockReturnValue({ findByEmail: vi.fn().mockResolvedValue(null) });
    const scope = await createRequestScope();
    expect(scope.cradle.passwordAuthService).toBeInstanceOf(PasswordAuthService);
    await expect(scope.cradle.passwordAuthService.authenticate("missing@example.test", "ignored password")).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(scope.cradle.passwordAuthService.confirmRegistration("invalid-token", "ignored password")).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(scope.cradle.mailer.send({ to: "ada@example.test", subject: "Confirm", text: "Link" })).rejects.toBeInstanceOf(ServiceUnavailableError);
    expect(() => scope.cradle.githubIdentity.createAuthorizationUrl("state", "https://devmentor.example/callback")).toThrowError(ServiceUnavailableError);
    await expect(scope.cradle.githubIdentity.exchangeCode("code", "https://devmentor.example/callback")).rejects.toBeInstanceOf(ServiceUnavailableError);
    await expect(scope.cradle.githubIdentity.getUser("access-token")).rejects.toBeInstanceOf(ServiceUnavailableError);
    await expect(scope.cradle.githubIdentity.getEmails("access-token")).rejects.toBeInstanceOf(ServiceUnavailableError);
  });
});

describe("withScope", () => {
  it("runs the callback with the request scope's cradle and returns its result", async () => {
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createMentorRepository.mockReturnValue({ findAll: vi.fn().mockResolvedValue(["mentor"]), create: vi.fn() });

    const result = await withScope(({ mentorService }) => mentorService.list());

    expect(result).toEqual(["mentor"]);
  });

  it("propagates errors from the callback", async () => {
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    await expect(
      withScope(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrowError("boom");
  });
});
