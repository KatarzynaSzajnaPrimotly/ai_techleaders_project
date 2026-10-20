import { describe, expect, it } from "vitest";
import { migrationsStep } from "./migrations.step";

describe("migrationsStep", () => {
  it("is done when migrations were applied", async () => {
    expect(await migrationsStep(async () => 2).run()).toEqual({ status: "done", detail: "applied 2 migration(s)" });
  });

  it("is skipped when nothing was pending", async () => {
    expect(await migrationsStep(async () => 0).run()).toEqual({ status: "skipped", detail: "no pending migrations" });
  });

  it("propagates migrator failures", async () => {
    await expect(
      migrationsStep(async () => {
        throw new Error("boom");
      }).run(),
    ).rejects.toThrow("boom");
  });
});
