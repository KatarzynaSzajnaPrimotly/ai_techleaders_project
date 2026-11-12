import { asClass, asFunction, asValue, createContainer, InjectionMode, type AwilixContainer } from "awilix";
import {
  AccountService,
  InvitationService,
  logger,
  MentorService,
  PlatformSettingsService,
  AvailabilityService,
  BookingService,
  PasswordAuthService,
  createLogMailerAdapter,
  createMemoryRateLimiter,
  createPasswordHasher,
  createGithubIdentityAdapter,
  selectAdapter,
  type GithubIdentityPort,
  type MailMessage,
  type MailerPort,
  type PasswordHasherPort,
  type MentorRepositoryPort,
  type AvailabilityRepositoryPort,
  type BookingRepositoryPort,
  type RateLimiterPort,
  type UserRepositoryPort,
  type InvitationRepositoryPort,
  type InvitationEventPublisherPort,
} from "@devmentor/core";
import { createAvailabilityRepository, createBookingRepository, createInvitationRepository, createMentorRepository, createOrm, createUserRepository, type Orm } from "@devmentor/db";
import { createLocalFileMailer } from "./local-file-mailer";

export interface Cradle {
  orm: Orm;
  em: Orm["em"];
  mentorRepository: MentorRepositoryPort;
  mentorService: MentorService;
  platformSettingsService: PlatformSettingsService;
  availabilityRepository: AvailabilityRepositoryPort;
  availabilityService: AvailabilityService;
  bookingRepository: BookingRepositoryPort;
  bookingService: BookingService;
  userRepository: UserRepositoryPort;
  invitationRepository: InvitationRepositoryPort;
  invitationEvents: InvitationEventPublisherPort;
  invitationService: InvitationService;
  now: () => Date;
  githubIdentity: GithubIdentityPort;
  accountService: AccountService;
  passwordHasher: PasswordHasherPort;
  passwordAuthService: PasswordAuthService;
  rateLimiter: RateLimiterPort;
  mailer: MailerPort;
}

const globalForContainer = globalThis as unknown as {
  devmentorContainer?: Promise<AwilixContainer<Cradle>>;
};

async function buildRootContainer(): Promise<AwilixContainer<Cradle>> {
  const orm = await createOrm();
  const container = createContainer<Cradle>({ injectionMode: InjectionMode.PROXY });
  container.register({ orm: asValue(orm) });
  return container;
}

function createConfiguredMailer(): MailerPort {
  return {
    async send(message) {
      const adapter = selectAdapter("MAILER_TRANSPORT", {
        log: createLogMailerAdapter(),
        "local-file": { send: (message: MailMessage) => createLocalFileMailer(process.env.LOCAL_MAILBOX_DIR).send(message) },
      }, process.env.MAILER_TRANSPORT);
      await adapter.send(message);
    },
  };
}

function createConfiguredGithubIdentity(): GithubIdentityPort {
  let adapter: GithubIdentityPort | undefined;
  const resolve = () => {
    adapter ??= createGithubIdentityAdapter();
    return adapter;
  };

  return {
    createAuthorizationUrl(state, redirectUri) {
      return resolve().createAuthorizationUrl(state, redirectUri);
    },
    async exchangeCode(code, redirectUri) {
      return resolve().exchangeCode(code, redirectUri);
    },
    async getUser(accessToken) {
      return resolve().getUser(accessToken);
    },
    async getEmails(accessToken) {
      return resolve().getEmails(accessToken);
    },
  };
}

// Every dependency is registered by hand (no loadModules globbing) so each binding stays greppable.
export async function createRequestScope(): Promise<AwilixContainer<Cradle>> {
  globalForContainer.devmentorContainer ??= buildRootContainer();
  const root = await globalForContainer.devmentorContainer;
  const scope = root.createScope();
  scope.register({
    em: asFunction(({ orm }: Cradle) => orm.em.fork()).scoped(),
    mentorRepository: asFunction(({ em }: Cradle) => createMentorRepository(em)).scoped(),
    platformSettingsService: asClass(PlatformSettingsService).scoped(),
    mentorService: asClass(MentorService).scoped(),
    availabilityRepository: asFunction(({ em }: Cradle) => createAvailabilityRepository(em)).scoped(),
    availabilityService: asClass(AvailabilityService).scoped(),
    bookingRepository: asFunction(({ em }: Cradle) => createBookingRepository(em)).scoped(),
    bookingService: asClass(BookingService).scoped(),
    userRepository: asFunction(({ em }: Cradle) => createUserRepository(em)).scoped(),
    invitationRepository: asFunction(({ em }: Cradle) => createInvitationRepository(em)).scoped(),
    invitationEvents: asFunction((): InvitationEventPublisherPort => ({
      async publishInvitationAccepted(event) {
        logger.info({ invitationId: event.invitationId, userId: event.userId, publishDueAt: event.publishDueAt }, event.type);
      },
    })).scoped(),
    now: asFunction(() => () => new Date()).scoped(),
    invitationService: asClass(InvitationService).scoped(),
    githubIdentity: asFunction(() => createConfiguredGithubIdentity()).scoped(),
    accountService: asClass(AccountService).scoped(),
    passwordHasher: asFunction(() => createPasswordHasher()).scoped(),
    passwordAuthService: asClass(PasswordAuthService).scoped(),
    rateLimiter: asFunction(() => createMemoryRateLimiter()).scoped(),
    mailer: asFunction(() => createConfiguredMailer()).scoped(),
  });
  return scope;
}

export async function withScope<T>(run: (cradle: Cradle) => Promise<T>): Promise<T> {
  const scope = await createRequestScope();
  return run(scope.cradle);
}
