import { z } from "zod";

const MIN_JWT_SECRET_LENGTH = 32;
const positiveSafeIntegerSetting = z.string().regex(/^[1-9]\d*$/).transform(Number).refine(Number.isSafeInteger);
const optionalPositiveSafeIntegerSetting = z.preprocess((value) => value === "" ? undefined : value, positiveSafeIntegerSetting.optional());

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  INTEGRATION_TEST: z.enum(["true"]).optional(),
  PAYMENT_GATEWAY: z.enum(["test"]).optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().min(32).optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH).optional(),
  ALLOW_INSECURE_HTTP: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_OAUTH_BASE_URL: z.string().optional(),
  GITHUB_API_BASE_URL: z.string().optional(),
  TRUST_PROXY_HOPS: z.string().regex(/^(0|[1-9]\d*)$/).transform(Number).optional(),
  INVITATION_TTL_DAYS: positiveSafeIntegerSetting.prefault("14"),
  MENTOR_PUBLISH_WINDOW_DAYS: positiveSafeIntegerSetting.prefault("14"),
  PRICE_MIN_25_CENTS: optionalPositiveSafeIntegerSetting,
  PRICE_MAX_25_CENTS: optionalPositiveSafeIntegerSetting,
  PRICE_MIN_50_CENTS: optionalPositiveSafeIntegerSetting,
  PRICE_MAX_50_CENTS: optionalPositiveSafeIntegerSetting,
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
