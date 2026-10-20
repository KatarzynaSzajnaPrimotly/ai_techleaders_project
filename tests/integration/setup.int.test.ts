import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, inject, it } from "vitest";
import { connectWithMikroOrm } from "../../packages/db/src/setup/database.step";

const root = path.resolve(import.meta.dirname, "../..");
const envLocal = path.join(root, "packages/app/.env.local");
const migrationsDir = path.join(root, "packages/db/migrations");
const hadEnvLocal = fs.existsSync(envLocal);

const adminUrl = new URL(inject("databaseUrl"));
const databaseName = `devmentor_setup_${Date.now().toString(36)}`;
const targetUrl = new URL(adminUrl);
targetUrl.pathname = `/${databaseName}`;

function setup() {
  const result = spawnSync("npm", ["run", "setup"], {
    cwd: root,
    env: { ...process.env, DEVMENTOR_DATABASE_URL: targetUrl.toString() },
    encoding: "utf8",
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

afterAll(async () => {
  if (!hadEnvLocal) fs.rmSync(envLocal, { force: true });
  // The migrator writes a schema snapshot named after the database; this one is a throwaway.
  fs.rmSync(path.join(migrationsDir, `.snapshot-${databaseName}.json`), { force: true });
  adminUrl.pathname = "/postgres";
  const connection = await connectWithMikroOrm(adminUrl.toString());
  try {
    await connection.execute(`drop database if exists "${databaseName}" with (force)`);
  } finally {
    await connection.close();
  }
});

describe("npm run setup against a real PostgreSQL", () => {
  it("creates the database and applies migrations on the first run", () => {
    const { status, output } = setup();
    expect(output).toContain(`[done] Database: created database ${databaseName}`);
    expect(output).toMatch(/\[done\] Migrations: applied \d+ migration\(s\)/);
    expect(status).toBe(0);
  });

  it("is idempotent: a second run exits 0 and skips every step", () => {
    const { status, output } = setup();
    const lines = output.split("\n").filter((line) => /^\[(done|skipped|failed)\]/.test(line));
    expect(lines).toHaveLength(5);
    expect(lines.every((line) => line.startsWith("[skipped]"))).toBe(true);
    expect(status).toBe(0);
  });
});
