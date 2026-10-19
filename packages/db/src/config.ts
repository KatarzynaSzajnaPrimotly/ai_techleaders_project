export interface DatabaseConfig {
  url: string;
  pool: { min: number; max: number };
}

export function getDatabaseConfig(env: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  return {
    url: env.DEVMENTOR_DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/devmentor",
    pool: {
      min: Number(env.DATABASE_POOL_MIN ?? 2),
      max: Number(env.DATABASE_POOL_MAX ?? 10),
    },
  };
}
