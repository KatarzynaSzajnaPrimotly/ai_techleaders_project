import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { getDatabaseConfig, type DatabaseConfig } from "./config";
import { BookingSchema, InvitationSchema, MentorProfileSchema, MentorSchema, SlotSchema, UserSchema } from "./entities";

export function getOrmOptions(config: DatabaseConfig = getDatabaseConfig()) {
  return defineConfig({
    clientUrl: config.url,
    pool: config.pool,
    entities: [BookingSchema, InvitationSchema, MentorProfileSchema, MentorSchema, SlotSchema, UserSchema],
  });
}

export function createOrm(config?: DatabaseConfig) {
  return MikroORM.init(getOrmOptions(config));
}

export type Orm = Awaited<ReturnType<typeof createOrm>>;
