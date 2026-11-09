import { parseEnv } from "../../config/env-schema";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../../http/errors";
import type { User } from "../auth/user.types";
import type { Invitation } from "./invitation.types";
import type { InvitationRepositoryPort } from "./invitation-repository.port";
import type { InvitationEventPublisherPort } from "./invitation-events.port";
import { hashToken, mintOpaqueToken } from "./token.service";

export const INVITATION_INVALID_MESSAGE = "This invitation is not valid.";
export const INVITATION_STACK_TAGS = ["TypeScript", "React", "Python", "AI agents"] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface PublicInvitation {
  email: string;
  stackTags: string[];
  expiresAt: Date;
}

export interface CreatedInvitation {
  invitation: Invitation;
  token: string;
}

export interface AcceptedInvitation {
  user: User;
  roles: string[];
  publishDueAt: Date;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function plusDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function isPending(invitation: Invitation, now: Date): boolean {
  return invitation.acceptedAt === null && invitation.revokedAt === null && invitation.expiresAt > now;
}

function assertStackTags(stackTags: string[]): string[] {
  if (!Array.isArray(stackTags) || stackTags.length > INVITATION_STACK_TAGS.length || stackTags.some((tag) => !INVITATION_STACK_TAGS.includes(tag as typeof INVITATION_STACK_TAGS[number]))) {
    throw new ValidationError("Invitation stack tags are invalid");
  }
  return [...new Set(stackTags)];
}

function assertValidEmail(email: string): string {
  const normalized = normalizeEmail(email);
  if (normalized.length < 3 || normalized.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new ValidationError("Invitation e-mail is invalid", { email: ["Enter a valid e-mail address"] });
  }
  return normalized;
}

function invalidInvitation(): never {
  throw new NotFoundError(INVITATION_INVALID_MESSAGE);
}

export class InvitationService {
  private readonly invitationRepository: InvitationRepositoryPort;
  private readonly invitationEvents: InvitationEventPublisherPort;
  private readonly now: () => Date;

  constructor({ invitationRepository, invitationEvents, now = () => new Date() }: {
    invitationRepository: InvitationRepositoryPort;
    invitationEvents: InvitationEventPublisherPort;
    now?: () => Date;
  }) {
    this.invitationRepository = invitationRepository;
    this.invitationEvents = invitationEvents;
    this.now = now;
  }

  async create(input: { email: string; stackTags: string[]; batch?: string | null }): Promise<CreatedInvitation> {
    const email = assertValidEmail(input.email);
    const stackTags = assertStackTags(input.stackTags);
    const now = this.now();
    const token = mintOpaqueToken();
    const tokenHash = hashToken(token);
    const { INVITATION_TTL_DAYS, OPERATOR_EMAILS } = parseEnv();
    const invitation = await this.invitationRepository.transaction(async (tx) => {
      const user = await tx.findUserByEmailForUpdate(email);
      if (user?.role === "mentor" || user?.roles?.includes("mentor")) {
        throw new ConflictError("This account already has the mentor role");
      }
      if (OPERATOR_EMAILS.includes(email)) throw new ForbiddenError("An operator e-mail cannot be invited as a mentor");
      return tx.createInvitation({
        email,
        tokenHash,
        stackTags,
        expiresAt: plusDays(now, INVITATION_TTL_DAYS),
        batch: input.batch?.trim() || null,
      });
    });
    return { invitation, token };
  }

  async lookup(token: string): Promise<PublicInvitation> {
    const invitation = await this.invitationRepository.findByTokenHash(hashToken(token));
    if (!invitation || !isPending(invitation, this.now())) invalidInvitation();
    return { email: invitation.email, stackTags: invitation.stackTags, expiresAt: invitation.expiresAt };
  }

  async accept(token: string, userId: string): Promise<AcceptedInvitation> {
    const now = this.now();
    const { MENTOR_PUBLISH_WINDOW_DAYS, OPERATOR_EMAILS } = parseEnv();
    const result = await this.invitationRepository.transaction(async (tx) => {
      // User-first locking serializes different historical invitations for this same account.
      const user = await tx.findUserByIdForUpdate(userId);
      if (!user) throw new NotFoundError("Account not found");
      const invitation = await tx.findInvitationByTokenHashForUpdate(hashToken(token));
      if (!invitation || !isPending(invitation, now)) invalidInvitation();
      if (!user.emailVerifiedAt || normalizeEmail(user.email) !== invitation.email) {
        throw new ForbiddenError("Sign in with the verified e-mail address invited");
      }
      if (OPERATOR_EMAILS.includes(normalizeEmail(user.email))) {
        throw new ForbiddenError("An operator account cannot accept a mentor invitation");
      }

      const publishDueAt = plusDays(now, MENTOR_PUBLISH_WINDOW_DAYS);
      invitation.acceptedAt = now;
      invitation.acceptedById = user.id;
      invitation.publishDueAt = publishDueAt;
      invitation.updatedAt = now;
      await tx.saveInvitation(invitation);

      const grantedUser = await tx.grantMentorRole(user.id);
      if (!grantedUser) throw new NotFoundError("Account not found");
      const profile = await tx.findMentorProfileForUpdate(user.id);
      if (!profile) {
        await tx.createMentorProfile(user.id, publishDueAt);
      } else if (!profile.initialPublishDueAt) {
        profile.initialPublishDueAt = publishDueAt;
        profile.updatedAt = now;
        await tx.saveMentorProfile(profile);
      }
      return {
        user: grantedUser,
        roles: [...new Set([...(grantedUser.roles ?? [grantedUser.role]), "mentor"])],
        publishDueAt,
        invitationId: invitation.id,
      };
    });
    try {
      await this.invitationEvents.publishInvitationAccepted({
        type: "invitations.invitation.accepted",
        invitationId: result.invitationId,
        userId: result.user.id,
        publishDueAt: result.publishDueAt,
      });
    } catch {
      // Events are informational; a subscriber must never undo a committed acceptance.
    }
    return { user: result.user, roles: result.roles, publishDueAt: result.publishDueAt };
  }

  async revoke(invitationId: string): Promise<void> {
    const now = this.now();
    await this.invitationRepository.transaction(async (tx) => {
      const invitation = await tx.findInvitationByIdForUpdate(invitationId);
      if (!invitation || invitation.acceptedAt || invitation.revokedAt) invalidInvitation();
      invitation.revokedAt = now;
      invitation.updatedAt = now;
      await tx.saveInvitation(invitation);
    });
  }

  async resend(invitationId: string): Promise<CreatedInvitation> {
    const now = this.now();
    const token = mintOpaqueToken();
    const { INVITATION_TTL_DAYS } = parseEnv();
    const invitation = await this.invitationRepository.transaction(async (tx) => {
      const current = await tx.findInvitationByIdForUpdate(invitationId);
      if (!current || current.acceptedAt || current.revokedAt) invalidInvitation();
      current.tokenHash = hashToken(token);
      current.expiresAt = plusDays(now, INVITATION_TTL_DAYS);
      current.updatedAt = now;
      await tx.saveInvitation(current);
      return current;
    });
    return { invitation, token };
  }

  async onboardingStatus(userId: string): Promise<{ initialPublishDueAt: Date | null }> {
    return { initialPublishDueAt: await this.invitationRepository.findInitialPublishDueAt(userId) };
  }
}
