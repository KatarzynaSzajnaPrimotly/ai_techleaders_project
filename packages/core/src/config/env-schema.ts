import { z } from "zod";

const MIN_JWT_SECRET_LENGTH = 32;

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH).optional(),
  ALLOW_INSECURE_HTTP: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_OAUTH_BASE_URL: z.string().optional(),
  GITHUB_API_BASE_URL: z.string().optional(),
  TRUST_PROXY_HOPS: z.string().regex(/^(0|[1-9]\d*)$/).transform(Number).optional(),
  MAILER_TRANSPORT: z.string().optional(),
  OPERATOR_EMAILS: z.string().default("").transform((value) =>
    value.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
  ),
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
