import pino, { type DestinationStream } from "pino";
import { parseEnv, type Env } from "./config/env";

const SENSITIVE_KEYS = ["password", "token", "jwt", "authorization", "cookie"];

export const REDACTED_PATHS = [
  ...SENSITIVE_KEYS,
  ...SENSITIVE_KEYS.map((key) => `*.${key}`),
  "req.headers.authorization",
  "req.headers.cookie",
];

export function createLogger(destination?: DestinationStream, level: Env["LOG_LEVEL"] = parseEnv().LOG_LEVEL) {
  return pino({ level, redact: { paths: REDACTED_PATHS, censor: "[REDACTED]" } }, destination);
}

export const logger = createLogger();
