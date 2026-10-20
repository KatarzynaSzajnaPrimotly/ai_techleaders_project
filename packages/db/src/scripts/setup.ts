import path from "node:path";
import { getDatabaseConfig } from "../config";
import { applyPendingMigrations } from "../migrator";
import { databaseStep } from "../setup/database.step";
import { envFileStep } from "../setup/env-file.step";
import { migrationsStep } from "../setup/migrations.step";
import { runSetup } from "../setup/runner";

const REPO_ROOT = path.resolve(__dirname, "../../../..");

// Node and dependencies are handled by scripts/setup.mjs, which has to run before anything is installed.
runSetup([envFileStep(REPO_ROOT), databaseStep(getDatabaseConfig()), migrationsStep(applyPendingMigrations)], console.log).then(
  (ok) => {
    if (!ok) process.exit(1);
  },
);
