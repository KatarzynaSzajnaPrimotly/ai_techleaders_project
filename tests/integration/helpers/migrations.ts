import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const MIGRATION_WORKSPACE = "@devmentor/db";

export interface MigrationCommandOptions {
  cwd: string;
  env: NodeJS.ProcessEnv;
}

export type MigrationCommandRunner = (command: string, args: string[], options: MigrationCommandOptions) => void;

function runMigration(command: string, args: string[], options: MigrationCommandOptions): void {
  execFileSync(command, args, { ...options, stdio: "pipe", encoding: "utf8" });
}

export function runMigrationCycle(
  databaseUrl: string,
  runner: MigrationCommandRunner = runMigration,
  environment: NodeJS.ProcessEnv = process.env,
): void {
  if (!databaseUrl.trim()) throw new Error("A throwaway database URL is required for the migration cycle");
  const options = {
    cwd: ROOT,
    env: { ...environment, DEVMENTOR_DATABASE_URL: databaseUrl },
  };
  for (const action of ["up", "down", "up"] as const) {
    runner("npm", ["run", `migration:${action}`, "-w", MIGRATION_WORKSPACE], options);
  }
}
