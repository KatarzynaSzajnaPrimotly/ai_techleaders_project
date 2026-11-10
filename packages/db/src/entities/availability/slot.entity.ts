import { EntitySchema } from "@mikro-orm/core";
import type { Slot } from "@devmentor/core";

export const SlotSchema = new EntitySchema<Slot>({
  name: "Slot",
  tableName: "slots",
  properties: {
    id: { type: "uuid", primary: true, defaultRaw: "gen_random_uuid()" },
    mentorProfileId: { type: "uuid", fieldName: "mentor_profile_id" },
    startsAt: { type: "Date", fieldName: "starts_at", columnType: "timestamptz" },
    removedAt: { type: "Date", fieldName: "removed_at", columnType: "timestamptz", nullable: true },
    createdAt: { type: "Date", fieldName: "created_at", columnType: "timestamptz", defaultRaw: "now()" },
  },
});
