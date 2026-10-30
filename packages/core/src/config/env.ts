import { logger } from "../logger";
import { ServiceUnavailableError } from "../http/errors";
import { parseEnv } from "./env-schema";

export { isMockAuthEnabled, parseEnv, type Env } from "./env-schema";

export function requireConfig<const Keys extends readonly string[]>(keys: Keys): Record<Keys[number], string> {
  const values: Partial<Record<Keys[number], string>> = {};
  const missing: string[] = [];

  for (const key of keys) {
    const value = process.env[key];
    if (value === undefined || value.trim() === "") {
      missing.push(key);
    } else {
      values[key as Keys[number]] = value;
    }
  }

  if (missing.length > 0) {
    throw new ServiceUnavailableError(`Required configuration is missing: ${missing.join(", ")}`);
  }

  return values as Record<Keys[number], string>;
}

export function requireJwtSecret(): string {
  const sessionSecret = process.env.SESSION_SECRET?.trim();
  const secret = sessionSecret || requireConfig(["JWT_SECRET"]).JWT_SECRET;
  if (secret.length < 32) {
    const variable = sessionSecret ? "SESSION_SECRET" : "JWT_SECRET";
    throw new ServiceUnavailableError(`Required configuration is invalid: ${variable}`);
  }
  return secret;
}

export function isInsecureHttpAllowed(): boolean {
  const allowed = parseEnv().ALLOW_INSECURE_HTTP === true;
  const appUrl = process.env.APP_URL;
  if (allowed && appUrl?.toLowerCase().startsWith("https://")) {
    logger.error("ALLOW_INSECURE_HTTP must not be set when APP_URL uses HTTPS");
  }
  return allowed;
}
