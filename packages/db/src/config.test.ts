import { afterEach, describe, expect, it, vi } from "vitest";
import { getDatabaseConfig } from "./config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getDatabaseConfig", () => {
  it("falls back to local defaults", () => {
    expect(getDatabaseConfig({})).toEqual({
      url: "postgresql://postgres:postgres@127.0.0.1:5432/devmentor",
      pool: { min: 2, max: 10 },
    });
  });

  it("reads the url and pool size from the given environment", () => {
    const config = getDatabaseConfig({
      DEVMENTOR_DATABASE_URL: "postgresql://u:p@db:5432/app",
      DATABASE_POOL_MIN: "1",
      DATABASE_POOL_MAX: "4",
    });
    expect(config).toEqual({ url: "postgresql://u:p@db:5432/app", pool: { min: 1, max: 4 } });
  });

  it("uses process.env when no environment is passed", () => {
    vi.stubEnv("DEVMENTOR_DATABASE_URL", "postgresql://env:env@host:5432/fromenv");
    vi.stubEnv("DATABASE_POOL_MAX", "7");
    const config = getDatabaseConfig();
    expect(config.url).toBe("postgresql://env:env@host:5432/fromenv");
    expect(config.pool.max).toBe(7);
  });

  it("ignores the generic DATABASE_URL", () => {
    expect(getDatabaseConfig({ DATABASE_URL: "postgres://other/db" }).url).toContain("/devmentor");
  });
});
