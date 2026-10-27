export interface RateLimitPolicy {
  /** Number of allowed hits in one rolling window. */
  maxHits: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiterPort {
  hit(key: string, policy: RateLimitPolicy): Promise<RateLimitResult>;
}
