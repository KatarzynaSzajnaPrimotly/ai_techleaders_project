import { LockMode, type EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import {
  ConflictError,
  type Invitation,
  type InvitationRepositoryPort,
  type InvitationTransactionPort,
  type MentorProfile,
  type NewInvitation,
  type User,
} from "@devmentor/core";
import { createUserRepository } from "../auth/user.repository";

const INVITATION = "Invitation" as unknown as EntityName<Invitation>;
const MENTOR_PROFILE = "MentorProfile" as unknown as EntityName<MentorProfile>;
const USER = "User" as unknown as EntityName<User>;
const UNIQUE_VIOLATION = "23505";

function conflictOnUniqueViolation(error: unknown): void {
  if ((error as { code?: string } | null)?.code === UNIQUE_VIOLATION) {
    throw new ConflictError("An unresolved invitation already exists for this e-mail");
  }
}

function createTransaction(em: EntityManager): InvitationTransactionPort {
  const userRepository = createUserRepository(em);
  return {
    findUserByIdForUpdate(userId) {
      return em.findOne<User>(USER, { id: userId }, { lockMode: LockMode.PESSIMISTIC_WRITE });
    },
    findUserByEmailForUpdate(email) {
      return em.findOne<User>(USER, { email }, { lockMode: LockMode.PESSIMISTIC_WRITE });
    },
    findInvitationByTokenHashForUpdate(tokenHash) {
      return em.findOne<Invitation>(INVITATION, { tokenHash }, { lockMode: LockMode.PESSIMISTIC_WRITE });
    },
    findInvitationByIdForUpdate(invitationId) {
      return em.findOne<Invitation>(INVITATION, { id: invitationId }, { lockMode: LockMode.PESSIMISTIC_WRITE });
    },
    async createInvitation(input: NewInvitation) {
      const now = new Date();
      const invitation = em.create<Invitation>(INVITATION, {
        ...input,
        acceptedAt: null,
        acceptedById: null,
        publishDueAt: null,
        revokedAt: null,
        createdAt: now,
        updatedAt: now,
      });
      await em.flush();
      return invitation;
    },
    async saveInvitation() {
      await em.flush();
    },
    async grantMentorRole(userId) {
      if (!await userRepository.grantRole(userId, "mentor")) return null;
      return userRepository.findById(userId);
    },
    findMentorProfileForUpdate(userId) {
      return em.findOne<MentorProfile>(MENTOR_PROFILE, { userId }, { lockMode: LockMode.PESSIMISTIC_WRITE });
    },
    async createMentorProfile(userId, initialPublishDueAt) {
      const now = new Date();
      return em.create<MentorProfile>(MENTOR_PROFILE, { userId, initialPublishDueAt, createdAt: now, updatedAt: now });
    },
    async saveMentorProfile() {
      await em.flush();
    },
  };
}

export function createInvitationRepository(em: EntityManager): InvitationRepositoryPort {
  return {
    async transaction<T>(run: (transaction: InvitationTransactionPort) => Promise<T>): Promise<T> {
      try {
        return await em.transactional((txEm) => run(createTransaction(txEm)));
      } catch (error) {
        conflictOnUniqueViolation(error);
        throw error;
      }
    },
    findByTokenHash(tokenHash) {
      return em.findOne<Invitation>(INVITATION, { tokenHash });
    },
    async findInitialPublishDueAt(userId) {
      const profile = await em.findOne<MentorProfile>(MENTOR_PROFILE, { userId });
      return profile?.initialPublishDueAt ?? null;
    },
  };
}
