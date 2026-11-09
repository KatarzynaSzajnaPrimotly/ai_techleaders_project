import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { runMigrationCycle, type MigrationCommandOptions } from "./migrations";

describe("runMigrationCycle", () => {
  it("runs up, down, up against the supplied throwaway database", () => {
    const run = vi.fn((command: string, args: string[], options: MigrationCommandOptions) => {
      void command;
      void args;
      void options;
    });
    runMigrationCycle("postgresql://throwaway/db", run, { NODE_ENV: "test" });

    expect(run).toHaveBeenCalledTimes(3);
    expect(run.mock.calls.map(([, args]) => args)).toEqual([
      ["run", "migration:up", "-w", "@devmentor/db"],
      ["run", "migration:down", "-w", "@devmentor/db"],
      ["run", "migration:up", "-w", "@devmentor/db"],
    ]);
    expect(run.mock.calls[0]?.[0]).toBe("npm");
    expect(run.mock.calls[0]?.[2].env).toEqual({ NODE_ENV: "test", DEVMENTOR_DATABASE_URL: "postgresql://throwaway/db" });
    expect(run.mock.calls[0]?.[2].cwd).toBe(path.resolve(import.meta.dirname, "../../.."));
  });

  it("rejects an empty database URL before running commands", () => {
    const run = vi.fn();
    expect(() => runMigrationCycle("  ", run)).toThrow("A throwaway database URL is required");
    expect(run).not.toHaveBeenCalled();
  });
});
