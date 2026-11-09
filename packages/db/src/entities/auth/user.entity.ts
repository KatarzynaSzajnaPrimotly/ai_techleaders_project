import { EntitySchema } from "@mikro-orm/core";
import type { User } from "@devmentor/core";

export const UserSchema = new EntitySchema<User>({
  name: "User",
  tableName: "users",
  properties: {
    id: { type: "uuid", primary: true, defaultRaw: "gen_random_uuid()" },
    email: { type: "string", columnType: "text", unique: true },
    emailVerifiedAt: { type: "Date", fieldName: "email_verified_at", columnType: "timestamptz", nullable: true },
    passwordHash: { type: "string", fieldName: "password_hash", columnType: "text", nullable: true },
    displayName: { type: "string", fieldName: "display_name", columnType: "text", nullable: true },
    role: { type: "string", columnType: "text", default: "mentee", check: "role in ('mentee', 'mentor')" },
    roles: { type: Array, columnType: "text[]", defaultRaw: "ARRAY['mentee']::text[]" },
    sessionVersion: { type: "integer", fieldName: "session_version", default: 0 },
    githubId: { type: "string", fieldName: "github_id", columnType: "text", unique: true, nullable: true },
    githubLogin: { type: "string", fieldName: "github_login", columnType: "text", nullable: true },
    avatarUrl: { type: "string", fieldName: "avatar_url", columnType: "text", nullable: true },
    createdAt: { type: "Date", fieldName: "created_at", columnType: "timestamptz", defaultRaw: "now()" },
    updatedAt: { type: "Date", fieldName: "updated_at", columnType: "timestamptz", defaultRaw: "now()" },
  },
});
