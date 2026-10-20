import path from "node:path";
import { MikroORM } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { getOrmOptions } from "./orm";

const MIGRATIONS_DIR = path.resolve(__dirname, "../migrations");

function initMigratorOrm() {
  return MikroORM.init({
    ...getOrmOptions(),
    extensions: [Migrator],
    migrations: { path: MIGRATIONS_DIR, pathTs: MIGRATIONS_DIR },
  });
}

type MigratorOrm = Awaited<ReturnType<typeof initMigratorOrm>>;

/** Runs the action with a migrator and always closes the connection afterwards. */
export async function withMigrator<T>(action: (migrator: MigratorOrm["migrator"]) => Promise<T>): Promise<T> {
  const orm = await initMigratorOrm();
  try {
    return await action(orm.migrator);
  } finally {
    await orm.close();
  }
}

/** Applies pending migrations and returns how many were applied. */
export function applyPendingMigrations(): Promise<number> {
  return withMigrator(async (migrator) => (await migrator.up()).length);
}
