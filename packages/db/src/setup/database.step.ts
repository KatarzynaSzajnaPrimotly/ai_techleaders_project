import { MikroORM } from "@mikro-orm/postgresql";
import type { DatabaseConfig } from "../config";
import { SetupError, type SetupStep } from "./types";

/** PostgreSQL SQLSTATE for "database already exists", raised when another run created it first. */
const DUPLICATE_DATABASE = "42P04";
/** The database every PostgreSQL server has, used to create the application database from. */
const MAINTENANCE_DATABASE = "postgres";
/** The name becomes a quoted SQL identifier, so only plain identifier characters are accepted. */
const SAFE_DATABASE_NAME = /^[A-Za-z0-9_]+$/;

export interface MaintenanceConnection {
  execute(sql: string, params?: unknown[]): Promise<unknown[]>;
  close(): Promise<void>;
}

export type Connect = (url: string) => Promise<MaintenanceConnection>;

export const connectWithMikroOrm: Connect = async (url) => {
  const orm = await MikroORM.init({
    clientUrl: url,
    entities: [],
    discovery: { warnWhenNoEntities: false },
  });
  return { execute: (sql, params) => orm.em.getConnection().execute(sql, params), close: () => orm.close() };
};

/** Creates the application database when it is missing. Needs a reachable server and CREATE DATABASE rights. */
export function databaseStep(config: DatabaseConfig, connect: Connect = connectWithMikroOrm): SetupStep {
  return {
    name: "Database",
    async run() {
      const url = new URL(config.url);
      const name = decodeURIComponent(url.pathname.slice(1));
      if (!SAFE_DATABASE_NAME.test(name)) {
        throw new SetupError(
          `Database name "${name}" in DEVMENTOR_DATABASE_URL is not a plain identifier`,
          "Use only letters, digits and underscores in the database name.",
        );
      }
      url.pathname = `/${MAINTENANCE_DATABASE}`;
      const target = `${url.hostname}:${url.port || "5432"}`;

      let connection: MaintenanceConnection;
      try {
        connection = await connect(url.toString());
      } catch (error) {
        throw new SetupError(
          `Cannot reach PostgreSQL at ${target}: ${error instanceof Error ? error.message : String(error)}`,
          "Start PostgreSQL, or point DEVMENTOR_DATABASE_URL at a running server.",
        );
      }
      try {
        const existing = await connection.execute("select 1 from pg_database where datname = ?", [name]);
        if (existing.length > 0) return { status: "skipped", detail: `database ${name} already exists` };
        await connection.execute(`create database "${name}"`);
        return { status: "done", detail: `created database ${name}` };
      } catch (error) {
        if ((error as { code?: string }).code === DUPLICATE_DATABASE) {
          return { status: "skipped", detail: `database ${name} already exists` };
        }
        throw new SetupError(
          `Cannot create database ${name} on ${target}: ${error instanceof Error ? error.message : String(error)}`,
          "Create it manually, or use a role with CREATE DATABASE rights.",
        );
      } finally {
        await connection.close();
      }
    },
  };
}
