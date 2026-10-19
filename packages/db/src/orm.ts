import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { getDatabaseConfig, type DatabaseConfig } from "./config";
import { MentorSchema } from "./entities";

export function getOrmOptions(config: DatabaseConfig = getDatabaseConfig()) {
  return defineConfig({
    clientUrl: config.url,
    pool: config.pool,
    entities: [MentorSchema],
  });
}

export function createOrm(config?: DatabaseConfig) {
  return MikroORM.init(getOrmOptions(config));
}

export type Orm = Awaited<ReturnType<typeof createOrm>>;
