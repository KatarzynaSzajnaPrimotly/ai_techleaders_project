import type { EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { ConflictError, type NewUser, type StoredRole, type User, type UserRepositoryPort } from "@devmentor/core";

// Resolve the metadata by name because Next can load a second copy of this package per route.
const USER = "User" as unknown as EntityName<User>;
const UNIQUE_VIOLATION = "23505";
const DUPLICATE_USER_MESSAGE = "A user with this e-mail or GitHub identity already exists";

function conflictOnUniqueViolation(error: unknown): never | void {
  if ((error as { code?: string } | null)?.code === UNIQUE_VIOLATION) {
    throw new ConflictError(DUPLICATE_USER_MESSAGE);
  }
}

export function createUserRepository(em: EntityManager): UserRepositoryPort {
  return {
    async findByEmail(email): Promise<User | null> {
      return em.findOne<User>(USER, { email: email.trim().toLowerCase() });
    },
    async findByGithubId(githubId): Promise<User | null> {
      return em.findOne<User>(USER, { githubId });
    },
    async create(input: NewUser): Promise<User> {
      const now = new Date();
      const user = em.create<User>(USER, {
        ...input,
        email: input.email.trim().toLowerCase(),
        passwordHash: input.passwordHash ?? null,
        role: input.role ?? "mentee",
        displayName: input.displayName ?? null,
        githubId: input.githubId ?? null,
        githubLogin: input.githubLogin ?? null,
        avatarUrl: input.avatarUrl ?? null,
        createdAt: now,
        updatedAt: now,
      });
      try {
        await em.flush();
      } catch (error) {
        conflictOnUniqueViolation(error);
        throw error;
      }
      return user;
    },
    async linkGithub(userId: string, githubId: string): Promise<boolean> {
      try {
        const changed = await em.nativeUpdate<User>(USER, { id: userId, githubId: null }, { githubId, updatedAt: new Date() });
        return changed === 1;
      } catch (error) {
        conflictOnUniqueViolation(error);
        throw error;
      }
    },
    async grantRole(userId: string, role: StoredRole): Promise<boolean> {
      const changed = await em.nativeUpdate<User>(USER, { id: userId }, { role, updatedAt: new Date() });
      return changed === 1;
    },
  };
}
