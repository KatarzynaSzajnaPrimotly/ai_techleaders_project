export interface InvitationAcceptedEvent {
  type: "invitations.invitation.accepted";
  invitationId: string;
  userId: string;
  publishDueAt: Date;
}

export interface InvitationEventPublisherPort {
  publishInvitationAccepted(event: InvitationAcceptedEvent): Promise<void>;
}
