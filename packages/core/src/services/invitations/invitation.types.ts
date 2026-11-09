export interface Invitation {
  id: string;
  email: string;
  tokenHash: string;
  stackTags: string[];
  expiresAt: Date;
  acceptedAt: Date | null;
  acceptedById: string | null;
  publishDueAt: Date | null;
  revokedAt: Date | null;
  batch: string | null;
  createdAt: Date;
  updatedAt: Date;
}
