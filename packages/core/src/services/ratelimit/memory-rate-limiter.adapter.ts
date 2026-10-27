import type { RateLimiterPort, RateLimitPolicy, RateLimitResult } from "./rate-limiter.port";

const MAX_RATE_LIMIT_KEYS = 10_000;
const MILLISECONDS_PER_SECOND = 1_000;
const GLOBAL_STATE_KEY = "__devmentorRateLimiterState";

interface Counter {
  count: number;
  expiresAt: number;
}

interface RateLimitState {
  counters: Map<string, Counter>;
}

type GlobalWithRateLimits = typeof globalThis & { [GLOBAL_STATE_KEY]?: RateLimitState };

function sharedState(): RateLimitState {
  const globalState = globalThis as GlobalWithRateLimits;
  globalState[GLOBAL_STATE_KEY] ??= { counters: new Map() };
  return globalState[GLOBAL_STATE_KEY];
}

function retryAfter(expiresAt: number, now: number): number {
  return Math.max(1, Math.ceil((expiresAt - now) / MILLISECONDS_PER_SECOND));
}

/**
 * In-memory rate limiting for one Node instance (platform contract Q6).
 * The global store is shared across bundled copies. Expired keys are swept on each hit;
 * a full store refuses new keys without evicting active counters.
 */
export function createMemoryRateLimiter(options: { now?: () => number; maxKeys?: number } = {}): RateLimiterPort {
  const now = options.now ?? Date.now;
  const maxKeys = options.maxKeys ?? MAX_RATE_LIMIT_KEYS;

  return {
    async hit(key: string, policy: RateLimitPolicy): Promise<RateLimitResult> {
      const timestamp = now();
      const counters = sharedState().counters;
      for (const [counterKey, counter] of counters) {
        if (counter.expiresAt <= timestamp) counters.delete(counterKey);
      }

      const existing = counters.get(key);
      if (existing) {
        if (existing.count >= policy.maxHits) {
          return { allowed: false, retryAfterSeconds: retryAfter(existing.expiresAt, timestamp) };
        }
        existing.count += 1;
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (counters.size >= maxKeys) {
        return { allowed: false, retryAfterSeconds: policy.windowSeconds };
      }

      counters.set(key, {
        count: 1,
        expiresAt: timestamp + policy.windowSeconds * MILLISECONDS_PER_SECOND,
      });
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
