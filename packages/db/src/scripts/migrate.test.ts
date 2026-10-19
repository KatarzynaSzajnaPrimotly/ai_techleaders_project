import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  init: vi.fn(),
  create: vi.fn(),
  up: vi.fn(),
  down: vi.fn(),
  close: vi.fn(),
}));

vi.mock("@mikro-orm/postgresql", () => ({ MikroORM: { init: mocks.init } }));
vi.mock("@mikro-orm/migrations", () => ({ Migrator: class Migrator {} }));
vi.mock("../orm", () => ({ getOrmOptions: () => ({ clientUrl: "postgresql://test/db" }) }));

const originalArgv = process.argv;
let exit: ReturnType<typeof vi.spyOn>;
let log: ReturnType<typeof vi.spyOn>;
let error: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.resetModules();
  Object.values(mocks).forEach((mock) => mock.mockReset());
  mocks.close.mockResolvedValue(undefined);
  mocks.init.mockResolvedValue({ migrator: { create: mocks.create, up: mocks.up, down: mocks.down }, close: mocks.close });
  exit = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
  log = vi.spyOn(console, "log").mockImplementation(() => undefined);
  error = vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.argv = originalArgv;
  vi.restoreAllMocks();
});

async function run(...args: string[]) {
  process.argv = ["node", "migrate.ts", ...args];
  await import("./migrate");
  await vi.waitFor(() => expect(mocks.close).toHaveBeenCalled());
}

describe("migrate script", () => {
  it("configures the migrator with the migrations folder", async () => {
    mocks.up.mockResolvedValue([]);
    await run("up");
    const options = mocks.init.mock.calls[0][0];
    expect(options.clientUrl).toBe("postgresql://test/db");
    expect(options.extensions).toHaveLength(1);
    const expectedPath = path.resolve(__dirname, "../../migrations");
    expect(options.migrations).toEqual({ path: expectedPath, pathTs: expectedPath });
  });

  it("creates a migration", async () => {
    mocks.create.mockResolvedValue({ fileName: "Migration1.ts" });
    await run("create");
    expect(mocks.create).toHaveBeenCalledWith(undefined, false, false);
    expect(log).toHaveBeenCalledWith("Created Migration1.ts");
  });

  it("creates an initial migration when --initial is given", async () => {
    mocks.create.mockResolvedValue({ fileName: "Initial.ts" });
    await run("create", "--initial");
    expect(mocks.create).toHaveBeenCalledWith(undefined, false, true);
  });

  it("applies pending migrations", async () => {
    mocks.up.mockResolvedValue([{}, {}]);
    await run("up");
    expect(log).toHaveBeenCalledWith("Applied 2 migration(s)");
    expect(exit).not.toHaveBeenCalled();
  });

  it("reverts the last migration", async () => {
    mocks.down.mockResolvedValue([{}]);
    await run("down");
    expect(log).toHaveBeenCalledWith("Reverted 1 migration(s)");
  });

  it("fails on an unknown command, still closing the connection", async () => {
    await run("bogus");
    await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(1));
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ message: "Usage: migrate.ts <create|up|down>" }));
  });

  it("fails when the command throws", async () => {
    mocks.up.mockRejectedValue(new Error("boom"));
    await run("up");
    await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(1));
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }));
  });
});
