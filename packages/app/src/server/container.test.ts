import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountService, MentorService } from "@devmentor/core";

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
    expect(scope.cradle.accountService).toBeInstanceOf(AccountService);
  });

  it("registers the in-memory rate limiter and selects the log mailer only explicitly", async () => {
    vi.stubEnv("MAILER_TRANSPORT", "log");
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    const scope = await createRequestScope();
    expect(scope.cradle.rateLimiter).toMatchObject({ hit: expect.any(Function) });
    expect(scope.cradle.mailer).toMatchObject({ send: expect.any(Function) });
  });

  it("fails closed when mail adapter configuration is unset", async () => {
    delete process.env.MAILER_TRANSPORT;
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    const scope = await createRequestScope();
    expect(() => scope.cradle.mailer).toThrowError(
      expect.objectContaining({ name: "ServiceUnavailableError", status: 503, message: "Required adapter configuration is missing: MAILER_TRANSPORT" }),
    );
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
