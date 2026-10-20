import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  runSetup: vi.fn(),
  envFileStep: vi.fn(() => "env-step"),
  databaseStep: vi.fn(() => "db-step"),
  migrationsStep: vi.fn(() => "migrations-step"),
}));

vi.mock("../setup/runner", () => ({ runSetup: mocks.runSetup }));
vi.mock("../setup/env-file.step", () => ({ envFileStep: mocks.envFileStep }));
vi.mock("../setup/database.step", () => ({ databaseStep: mocks.databaseStep }));
vi.mock("../setup/migrations.step", () => ({ migrationsStep: mocks.migrationsStep }));
vi.mock("../migrator", () => ({ applyPendingMigrations: vi.fn() }));
vi.mock("../config", () => ({ getDatabaseConfig: () => ({ url: "postgresql://test/db", pool: { min: 1, max: 2 } }) }));

let exit: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.resetModules();
  mocks.runSetup.mockReset();
  exit = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function run() {
  await import("./setup");
  await vi.waitFor(() => expect(mocks.runSetup).toHaveBeenCalled());
}

describe("setup script", () => {
  it("runs env, database and migrations steps against the repository root", async () => {
    mocks.runSetup.mockResolvedValue(true);
    await run();
    expect(mocks.runSetup).toHaveBeenCalledWith(["env-step", "db-step", "migrations-step"], console.log);
    expect(mocks.envFileStep).toHaveBeenCalledWith(path.resolve(__dirname, "../../../.."));
    expect(exit).not.toHaveBeenCalled();
  });

  it("exits with 1 when a step fails", async () => {
    mocks.runSetup.mockResolvedValue(false);
    await run();
    await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(1));
  });
});
