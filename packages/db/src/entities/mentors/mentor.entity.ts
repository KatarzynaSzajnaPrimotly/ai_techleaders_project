import { EntitySchema } from "@mikro-orm/core";
import type { Mentor } from "@devmentor/core";

export const MentorSchema = new EntitySchema<Mentor>({
  name: "Mentor",
  tableName: "mentors",
  properties: {
    id: { type: "uuid", primary: true, defaultRaw: "gen_random_uuid()" },
    name: { type: "string" },
    email: { type: "string", unique: true },
    createdAt: { type: "Date" },
  },
});
