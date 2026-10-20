import { beforeEach, describe, expect, it, vi } from "vitest";
import { connectWithMikroOrm, databaseStep, type MaintenanceConnection } from "./database.step";
import { SetupError } from "./types";

const mikro = vi.hoisted(() => ({ init: vi.fn() }));
vi.mock("@mikro-orm/postgresql", () => ({ MikroORM: { init: mikro.init } }));

const config = { url: "postgresql://user:secret@db.example:6543/devmentor", pool: { min: 1, max: 2 } };

function fakeConnection(execute: MaintenanceConnection["execute"]) {
  const close = vi.fn().mockResolvedValue(undefined);
  return { connection: { execute, close }, close };
}

describe("databaseStep", () => {
  it("creates the database when it is missing, connecting through the maintenance database", async () => {
    const execute = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const { connection, close } = fakeConnection(execute);
    const connect = vi.fn().mockResolvedValue(connection);

    const outcome = await databaseStep(config, connect).run();

    expect(outcome).toEqual({ status: "done", detail: "created database devmentor" });
    expect(connect).toHaveBeenCalledWith("postgresql://user:secret@db.example:6543/postgres");
    expect(execute).toHaveBeenNthCalledWith(1, "select 1 from pg_database where datname = ?", ["devmentor"]);
    expect(execute).toHaveBeenNthCalledWith(2, 'create database "devmentor"');
    expect(close).toHaveBeenCalled();
  });

  it("is skipped when the database exists", async () => {
    const execute = vi.fn().mockResolvedValue([{ "?column?": 1 }]);
    const { connection, close } = fakeConnection(execute);
    const outcome = await databaseStep(config, vi.fn().mockResolvedValue(connection)).run();
    expect(outcome.status).toBe("skipped");
    expect(execute).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalled();
  });

  it("is skipped when a concurrent run created the database first", async () => {
    const execute = vi.fn().mockResolvedValueOnce([]).mockRejectedValueOnce(Object.assign(new Error("dup"), { code: "42P04" }));
    const { connection } = fakeConnection(execute);
    const outcome = await databaseStep(config, vi.fn().mockResolvedValue(connection)).run();
    expect(outcome.status).toBe("skipped");
  });

  it("explains an unreachable server without leaking the password", async () => {
    const connect = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    const error = await databaseStep(config, connect).run().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SetupError);
    expect((error as SetupError).message).toBe("Cannot reach PostgreSQL at db.example:6543: ECONNREFUSED");
    expect((error as SetupError).message).not.toContain("secret");
  });

  it("stringifies a non-Error connection failure and defaults the port", async () => {
    const connect = vi.fn().mockRejectedValue("nope");
    const error = await databaseStep({ ...config, url: "postgresql://u@localhost/devmentor" }, connect).run().catch((e: unknown) => e);
    expect((error as SetupError).message).toBe("Cannot reach PostgreSQL at localhost:5432: nope");
  });

  it("reports a creation failure and still closes the connection", async () => {
    const execute = vi.fn().mockResolvedValueOnce([]).mockRejectedValueOnce(new Error("permission denied"));
    const { connection, close } = fakeConnection(execute);
    const error = await databaseStep(config, vi.fn().mockResolvedValue(connection)).run().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SetupError);
    expect((error as SetupError).message).toBe("Cannot create database devmentor on db.example:6543: permission denied");
    expect(close).toHaveBeenCalled();
  });

  it("stringifies a non-Error creation failure", async () => {
    const execute = vi.fn().mockResolvedValueOnce([]).mockRejectedValueOnce("denied");
    const { connection } = fakeConnection(execute);
    const error = await databaseStep(config, vi.fn().mockResolvedValue(connection)).run().catch((e: unknown) => e);
    expect((error as SetupError).message).toContain("denied");
  });

  it("rejects a database name that is not a plain identifier, without connecting", async () => {
    const connect = vi.fn();
    const url = "postgresql://u@localhost/" + encodeURIComponent('dev"; drop database x; --');
    await expect(databaseStep({ ...config, url }, connect).run()).rejects.toBeInstanceOf(SetupError);
    expect(connect).not.toHaveBeenCalled();
  });
});

describe("connectWithMikroOrm", () => {
  beforeEach(() => mikro.init.mockReset());

  it("opens an entity-less connection and exposes execute and close", async () => {
    const execute = vi.fn().mockResolvedValue([1]);
    const close = vi.fn().mockResolvedValue(undefined);
    mikro.init.mockResolvedValue({ em: { getConnection: () => ({ execute }) }, close });

    const connection = await connectWithMikroOrm("postgresql://u@h/postgres");
    expect(mikro.init).toHaveBeenCalledWith(expect.objectContaining({ clientUrl: "postgresql://u@h/postgres", entities: [] }));
    expect(await connection.execute("select 1", [])).toEqual([1]);
    await connection.close();
    expect(close).toHaveBeenCalled();
  });
});
