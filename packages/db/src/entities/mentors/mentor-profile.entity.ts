import { EntitySchema } from "@mikro-orm/core";
import type { MentorProfile } from "@devmentor/core";

export const MentorProfileSchema = new EntitySchema<MentorProfile>({
  name: "MentorProfile",
  tableName: "mentor_profiles",
  properties: {
    id: { type: "uuid", primary: true, defaultRaw: "gen_random_uuid()" },
    userId: { type: "uuid", fieldName: "user_id", unique: true },
    initialPublishDueAt: { type: "Date", fieldName: "initial_publish_due_at", columnType: "timestamptz", nullable: true },
    slug: { type: "string", nullable: true, unique: true, length: 60 },
    publicWorkUrl: { type: "string", fieldName: "public_work_url", columnType: "text", nullable: true },
    bio: { type: "string", columnType: "text", nullable: true },
    stackTags: { type: "text[]", fieldName: "stack_tags", default: "{}" },
    publishedAt: { type: "Date", fieldName: "published_at", columnType: "timestamptz", nullable: true },
    createdAt: { type: "Date", fieldName: "created_at", columnType: "timestamptz", defaultRaw: "now()" },
    updatedAt: { type: "Date", fieldName: "updated_at", columnType: "timestamptz", defaultRaw: "now()" },
  },
});
