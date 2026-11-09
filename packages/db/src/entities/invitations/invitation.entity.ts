import { EntitySchema } from "@mikro-orm/core";
import type { Invitation } from "@devmentor/core";

export const InvitationSchema = new EntitySchema<Invitation>({
  name: "Invitation",
  tableName: "invitations",
  properties: {
    id: { type: "uuid", primary: true, defaultRaw: "gen_random_uuid()" },
    email: { type: "string", columnType: "varchar(255)" },
    tokenHash: { type: "string", fieldName: "token_hash", columnType: "varchar(64)", unique: true },
    stackTags: { type: Array, fieldName: "stack_tags", columnType: "text[]" },
    expiresAt: { type: "Date", fieldName: "expires_at", columnType: "timestamptz" },
    acceptedAt: { type: "Date", fieldName: "accepted_at", columnType: "timestamptz", nullable: true },
    acceptedById: { type: "uuid", fieldName: "accepted_by_id", nullable: true },
    publishDueAt: { type: "Date", fieldName: "publish_due_at", columnType: "timestamptz", nullable: true },
    revokedAt: { type: "Date", fieldName: "revoked_at", columnType: "timestamptz", nullable: true },
    batch: { type: "string", columnType: "varchar(64)", nullable: true },
    createdAt: { type: "Date", fieldName: "created_at", columnType: "timestamptz", defaultRaw: "now()" },
    updatedAt: { type: "Date", fieldName: "updated_at", columnType: "timestamptz", defaultRaw: "now()" },
  },
});
