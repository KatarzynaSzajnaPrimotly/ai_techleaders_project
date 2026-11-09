import type { Invitation } from "./invitation.types";
import type { MentorProfile } from "../mentors/mentor-profile.types";
import type { User } from "../auth/user.types";

export interface NewInvitation {
  email: string;
  tokenHash: string;
  stackTags: string[];
  expiresAt: Date;
  batch: string | null;
}

export interface InvitationTransactionPort {
  findUserByIdForUpdate(userId: string): Promise<User | null>;
  findUserByEmailForUpdate(email: string): Promise<User | null>;
  findInvitationByTokenHashForUpdate(tokenHash: string): Promise<Invitation | null>;
  findInvitationByIdForUpdate(invitationId: string): Promise<Invitation | null>;
  createInvitation(input: NewInvitation): Promise<Invitation>;
  saveInvitation(invitation: Invitation): Promise<void>;
  grantMentorRole(userId: string): Promise<User | null>;
  findMentorProfileForUpdate(userId: string): Promise<MentorProfile | null>;
  createMentorProfile(userId: string, initialPublishDueAt: Date): Promise<MentorProfile>;
  saveMentorProfile(profile: MentorProfile): Promise<void>;
}

export interface InvitationRepositoryPort {
  transaction<T>(run: (transaction: InvitationTransactionPort) => Promise<T>): Promise<T>;
  findByTokenHash(tokenHash: string): Promise<Invitation | null>;
  findInitialPublishDueAt(userId: string): Promise<Date | null>;
}
