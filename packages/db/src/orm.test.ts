import { beforeEach, describe, expect, it, vi } from "vitest";

const init = vi.hoisted(() => vi.fn());

vi.mock("@mikro-orm/postgresql", () => ({
  defineConfig: (options: unknown) => options,
  MikroORM: { init },
}));

import { MentorSchema } from "./entities";
import { createOrm, getOrmOptions } from "./orm";

beforeEach(() => {
  init.mockReset();
});

describe("getOrmOptions", () => {
  it("builds options from an explicit config", () => {
    const options = getOrmOptions({ url: "postgresql://x/y", pool: { min: 1, max: 3 } });
    expect(options).toEqual({
      clientUrl: "postgresql://x/y",
      pool: { min: 1, max: 3 },
      entities: [MentorSchema],
    });
  });

  it("defaults to the environment based config", () => {
    const options = getOrmOptions();
    expect(options).toMatchObject({ entities: [MentorSchema], pool: { min: expect.any(Number), max: expect.any(Number) } });
  });
});

describe("createOrm", () => {
  it("initialises MikroORM with the built options", async () => {
    const orm = { em: {} };
    init.mockResolvedValue(orm);
    const config = { url: "postgresql://x/y", pool: { min: 2, max: 5 } };
    await expect(createOrm(config)).resolves.toBe(orm);
    expect(init).toHaveBeenCalledWith(getOrmOptions(config));
  });

  it("works without an explicit config", async () => {
    init.mockResolvedValue({});
    await createOrm();
    expect(init).toHaveBeenCalledTimes(1);
  });
});
