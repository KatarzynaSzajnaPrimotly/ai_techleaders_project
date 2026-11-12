import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountService, AvailabilityService, InvitationService, logger, MentorService, PasswordAuthService, ServiceUnavailableError, UnauthorizedError, ValidationError } from "@devmentor/core";

const mocks = vi.hoisted(() => ({
  createOrm: vi.fn(),
  createAvailabilityRepository: vi.fn(),
  createMentorRepository: vi.fn(),
  createUserRepository: vi.fn(),
  createInvitationRepository: vi.fn(),
  createBookingRepository: vi.fn(),
}));

vi.mock("@devmentor/db", () => ({
  createOrm: mocks.createOrm,
  createAvailabilityRepository: mocks.createAvailabilityRepository,
  createMentorRepository: mocks.createMentorRepository,
  createUserRepository: mocks.createUserRepository,
  createInvitationRepository: mocks.createInvitationRepository,
  createBookingRepository: mocks.createBookingRepository,
}));
const localMailer = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("./local-file-mailer", () => ({ createLocalFileMailer: vi.fn(() => localMailer) }));

import { createRequestScope, withScope } from "./container";

const globalForContainer = globalThis as unknown as { devmentorContainer?: unknown };

function createFakeOrm() {
  const fork = vi.fn(() => ({ forked: true }));
  return { orm: { em: { fork } }, fork };
}

beforeEach(() => {
  delete globalForContainer.devmentorContainer;
  mocks.createOrm.mockReset();
  mocks.createAvailabilityRepository.mockReset();
  mocks.createMentorRepository.mockReset();
  mocks.createUserRepository.mockReset();
  mocks.createInvitationRepository.mockReset();
  mocks.createBookingRepository.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

describe("createRequestScope", () => {
  it("registers booking repository and test payment services", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("PAYMENT_GATEWAY", "test");
    vi.stubEnv("PAYMENT_WEBHOOK_SECRET", "container-test-webhook-secret-more-than-32-characters");
    vi.stubEnv("APP_URL", "http://localhost:3000");
    const { orm } = createFakeOrm();
    const repository = { createHold: vi.fn(), findPendingOwned: vi.fn(), attachCheckoutSession: vi.fn(), settlePayment: vi.fn(), markRefunded: vi.fn() };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createBookingRepository.mockReturnValue(repository);
    const scope = await createRequestScope();
    expect(scope.cradle.bookingRepository).toBe(repository);
    expect(mocks.createBookingRepository).toHaveBeenCalledWith(scope.cradle.em);
    expect(scope.cradle.bookingService).toBeInstanceOf((await import("@devmentor/core")).BookingService);
    expect(scope.cradle.bookingPaymentService).toBeInstanceOf((await import("@devmentor/core")).BookingPaymentService);
    expect(scope.cradle.paymentGateway).toBeDefined();
  });

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

  it("registers the availability repository and service in the request scope", async () => {
    const { orm } = createFakeOrm();
    const repository = { listForMentor: vi.fn(), publishForMentor: vi.fn(), removeForMentor: vi.fn(), listForPublishedSlug: vi.fn() };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createAvailabilityRepository.mockReturnValue(repository);
    const scope = await createRequestScope();
    expect(scope.cradle.availabilityRepository).toBe(repository);
    expect(mocks.createAvailabilityRepository).toHaveBeenCalledWith(scope.cradle.em);
    expect(scope.cradle.availabilityService).toBeInstanceOf(AvailabilityService);
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

  it("wires the invitation service to its repository and request-scoped clock", async () => {
    const log = vi.spyOn(logger, "info").mockImplementation(() => logger);
    const { orm } = createFakeOrm();
    const repository = { transaction: vi.fn(), findByTokenHash: vi.fn(), findInitialPublishDueAt: vi.fn() };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createInvitationRepository.mockReturnValue(repository);

    const scope = await createRequestScope();

    expect(scope.cradle.invitationRepository).toBe(repository);
    expect(mocks.createInvitationRepository).toHaveBeenCalledWith(scope.cradle.em);
    expect(scope.cradle.invitationService).toBeInstanceOf(InvitationService);
    expect(scope.cradle.now()).toBeInstanceOf(Date);
    expect(typeof scope.cradle.invitationEvents.publishInvitationAccepted).toBe("function");
    const event = { type: "invitations.invitation.accepted", invitationId: "inv-1", userId: "u-1", publishDueAt: new Date(1) } as const;
    await scope.cradle.invitationEvents.publishInvitationAccepted(event);
    expect(log).toHaveBeenCalledWith({ invitationId: event.invitationId, userId: event.userId, publishDueAt: event.publishDueAt }, event.type);
  });

  it("registers the in-memory rate limiter and selects the log mailer only explicitly", async () => {
    vi.stubEnv("MAILER_TRANSPORT", "log");
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    const scope = await createRequestScope();
    expect(scope.cradle.rateLimiter).toMatchObject({ hit: expect.any(Function) });
    expect(scope.cradle.mailer).toMatchObject({ send: expect.any(Function) });
  });

  it("selects the local file mailer when configured", async () => {
    vi.stubEnv("MAILER_TRANSPORT", "local-file");
    vi.stubEnv("LOCAL_MAILBOX_DIR", "/tmp/devmentor-mailbox-test");
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);
    const scope = await createRequestScope();
    await scope.cradle.mailer.send({ to: "ada@example.test", subject: "Invite", text: "Link" });
    expect(localMailer.send).toHaveBeenCalledWith({ to: "ada@example.test", subject: "Invite", text: "Link" });
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
