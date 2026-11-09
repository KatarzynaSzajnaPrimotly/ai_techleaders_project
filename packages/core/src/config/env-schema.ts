import { z } from "zod";

const MIN_JWT_SECRET_LENGTH = 32;

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH).optional(),
  ALLOW_INSECURE_HTTP: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined> = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const names = Object.keys(z.flattenError(result.error).fieldErrors).join(", ");
    throw new Error(`Invalid environment variables: ${names}`);
  }
  return result.data;
}
