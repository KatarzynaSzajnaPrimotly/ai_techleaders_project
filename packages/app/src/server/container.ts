import { asClass, asFunction, asValue, createContainer, InjectionMode, type AwilixContainer } from "awilix";
import {
  AccountService,
  MentorService,
  createGithubIdentityAdapter,
  type GithubIdentityPort,
  type MentorRepositoryPort,
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
  });
  return scope;
}

export async function withScope<T>(run: (cradle: Cradle) => Promise<T>): Promise<T> {
  const scope = await createRequestScope();
  return run(scope.cradle);
}
