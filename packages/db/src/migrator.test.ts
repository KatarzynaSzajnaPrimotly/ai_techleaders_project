import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyPendingMigrations, withMigrator } from "./migrator";

const mocks = vi.hoisted(() => ({ init: vi.fn(), up: vi.fn(), close: vi.fn() }));
vi.mock("@mikro-orm/postgresql", () => ({ MikroORM: { init: mocks.init } }));
vi.mock("@mikro-orm/migrations", () => ({ Migrator: class Migrator {} }));
vi.mock("./orm", () => ({ getOrmOptions: () => ({ clientUrl: "postgresql://test/db" }) }));

beforeEach(() => {
  Object.values(mocks).forEach((mock) => mock.mockReset());
  mocks.close.mockResolvedValue(undefined);
  mocks.init.mockResolvedValue({ migrator: { up: mocks.up }, close: mocks.close });
});

describe("migrator", () => {
  it("counts the applied migrations and closes the connection", async () => {
    mocks.up.mockResolvedValue([{}, {}, {}]);
    expect(await applyPendingMigrations()).toBe(3);
    expect(mocks.close).toHaveBeenCalledTimes(1);
  });

  it("closes the connection when the action fails", async () => {
    await expect(
      withMigrator(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(mocks.close).toHaveBeenCalledTimes(1);
  });
});
