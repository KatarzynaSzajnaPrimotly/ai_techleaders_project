import { asClass, asFunction, asValue, createContainer, InjectionMode, type AwilixContainer } from "awilix";
import {
  AccountService,
  MentorService,
  createLogMailerAdapter,
  createMemoryRateLimiter,
  createGithubIdentityAdapter,
  selectAdapter,
  type GithubIdentityPort,
  type MailerPort,
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
    githubIdentity: asFunction(() => createGithubIdentityAdapter()).scoped(),
    accountService: asClass(AccountService).scoped(),
    rateLimiter: asFunction(() => createMemoryRateLimiter()).scoped(),
    mailer: asFunction(() => selectAdapter("MAILER_TRANSPORT", { log: createLogMailerAdapter() }, process.env.MAILER_TRANSPORT)).scoped(),
  });
  return scope;
}

export async function withScope<T>(run: (cradle: Cradle) => Promise<T>): Promise<T> {
  const scope = await createRequestScope();
  return run(scope.cradle);
}
