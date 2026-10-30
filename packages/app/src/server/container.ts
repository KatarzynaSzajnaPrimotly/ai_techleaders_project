import { asClass, asFunction, asValue, createContainer, InjectionMode, type AwilixContainer } from "awilix";
import {
  AccountService,
  MentorService,
  PasswordAuthService,
  createLogMailerAdapter,
  createMemoryRateLimiter,
  createPasswordHasher,
  createGithubIdentityAdapter,
  createMockGithubIdentityAdapter,
  parseEnv,
  selectAdapter,
  type GithubIdentityPort,
  type MailerPort,
  type PasswordHasherPort,
  type MentorRepositoryPort,
  type RateLimiterPort,
  type UserRepositoryPort,
} from "@devmentor/core";
import { createMentorRepository, createOrm, createUserRepository, type Orm } from "@devmentor/db";

export interface Cradle {
  orm: Orm;
  em: Orm["em"];
  mentorRepository: MentorRepositoryPort;
  mentorService: MentorService;
  userRepository: UserRepositoryPort;
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
      const adapter = selectAdapter("MAILER_TRANSPORT", { log: createLogMailerAdapter() }, process.env.MAILER_TRANSPORT);
      await adapter.send(message);
    },
  };
}

function createConfiguredGithubIdentity(): GithubIdentityPort {
  const env = parseEnv();
  let adapter: GithubIdentityPort | undefined;
  const resolve = () => {
    adapter ??= env.AUTH_IDENTITY_ADAPTER === "mock" ? createMockGithubIdentityAdapter() : createGithubIdentityAdapter();
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
    mentorService: asClass(MentorService).scoped(),
    userRepository: asFunction(({ em }: Cradle) => createUserRepository(em)).scoped(),
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
