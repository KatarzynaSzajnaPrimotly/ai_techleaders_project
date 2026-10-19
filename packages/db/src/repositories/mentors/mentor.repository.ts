import type { EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { ConflictError, type Mentor, type MentorRepositoryPort, type NewMentor } from "@devmentor/core";

// The entity is referenced by name, not by schema object: bundlers may load this package more than once
// (one copy per Next.js route), and the ORM only recognises the schema instance it was initialised with.
// The cast is needed because MikroORM 7 types no longer list string names, though it still resolves them.
const MENTOR = "Mentor" as unknown as EntityName<Mentor>;

// PostgreSQL error code for unique_violation.
const UNIQUE_VIOLATION = "23505";

export function createMentorRepository(em: EntityManager): MentorRepositoryPort {
  return {
    findAll(): Promise<Mentor[]> {
      return em.find<Mentor>(MENTOR, {}, { orderBy: { createdAt: "asc" } });
    },
    async create(input: NewMentor): Promise<Mentor> {
      const mentor = em.create<Mentor>(MENTOR, { ...input, createdAt: new Date() });
      try {
        await em.flush();
      } catch (error) {
        // Matched by code, not instanceof (see the note above about duplicate package copies).
        if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
          throw new ConflictError(`A mentor with email ${input.email} already exists`);
        }
        throw error;
      }
      return mentor;
    },
  };
}
