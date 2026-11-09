import { TooManyRequestsError } from "../../http/errors";
import type { RateLimiterPort, RateLimitPolicy } from "./rate-limiter.port";

export async function enforceRateLimit(
  rateLimiter: RateLimiterPort,
  key: string,
  policy: RateLimitPolicy,
): Promise<void> {
  const result = await rateLimiter.hit(key, policy);
  if (!result.allowed) throw new TooManyRequestsError(result.retryAfterSeconds);
}
