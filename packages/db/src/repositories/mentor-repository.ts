import type { EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { MentorAlreadyExistsError, type Mentor, type MentorRepository, type NewMentor } from "@devmentor/core";

// The entity is referenced by name, not by schema object: bundlers may load this package more than once
// (one copy per Next.js route), and the ORM only recognises the schema instance it was initialised with.
// The cast is needed because MikroORM 7 types no longer list string names, though it still resolves them.
const MENTOR = "Mentor" as unknown as EntityName<Mentor>;

export function createMentorRepository(em: EntityManager): MentorRepository {
  return {
    findAll(): Promise<Mentor[]> {
      return em.find<Mentor>(MENTOR, {}, { orderBy: { createdAt: "asc" } });
    },
    async create(input: NewMentor): Promise<Mentor> {
      const mentor = em.create<Mentor>(MENTOR, { ...input, createdAt: new Date() });
      try {
        await em.flush();
      } catch (error) {
        // 23505 = PostgreSQL unique_violation; matched by code, not instanceof (see note above).
        if ((error as { code?: string }).code === "23505") throw new MentorAlreadyExistsError(input.email);
        throw error;
      }
      return mentor;
    },
  };
}
