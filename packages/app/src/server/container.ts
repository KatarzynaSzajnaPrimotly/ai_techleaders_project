import { asClass, asFunction, asValue, createContainer, InjectionMode, type AwilixContainer } from "awilix";
import { MentorService, type MentorRepository } from "@devmentor/core";
import { createMentorRepository, createOrm, type Orm } from "@devmentor/db";

export interface Cradle {
  orm: Orm;
  em: Orm["em"];
  mentorRepository: MentorRepository;
  mentorService: MentorService;
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

export async function createRequestScope(): Promise<AwilixContainer<Cradle>> {
  globalForContainer.devmentorContainer ??= buildRootContainer();
  const root = await globalForContainer.devmentorContainer;
  const scope = root.createScope();
  scope.register({
    em: asFunction(({ orm }: Cradle) => orm.em.fork()).scoped(),
    mentorRepository: asFunction(({ em }: Cradle) => createMentorRepository(em)).scoped(),
    mentorService: asClass(MentorService).scoped(),
  });
  return scope;
}
