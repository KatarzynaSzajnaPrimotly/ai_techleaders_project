import { afterEach, describe, expect, it, vi } from "vitest";
import { createMemoryRateLimiter } from "./memory-rate-limiter.adapter";
interface RateLimitState {
  counters: Map<string, { count: number; expiresAt: number }>;
}

const GLOBAL_STATE_KEY = "__devmentorRateLimiterState";
const POLICY = { maxHits: 2, windowSeconds: 60 };

function counters(): Map<string, { count: number; expiresAt: number }> {
  const globalState = globalThis as typeof globalThis & { [GLOBAL_STATE_KEY]?: RateLimitState };
  globalState[GLOBAL_STATE_KEY] ??= { counters: new Map() };
  return globalState[GLOBAL_STATE_KEY].counters;
}

afterEach(() => counters().clear());

describe("createMemoryRateLimiter", () => {
  it("allows hits up to the limit and reports the remaining retry delay", async () => {
    let now = 1_000;
    const limiter = createMemoryRateLimiter({ now: () => now });
    await expect(limiter.hit("login:a", POLICY)).resolves.toEqual({ allowed: true, retryAfterSeconds: 0 });
    await expect(limiter.hit("login:a", POLICY)).resolves.toEqual({ allowed: true, retryAfterSeconds: 0 });
    await expect(limiter.hit("login:a", POLICY)).resolves.toEqual({ allowed: false, retryAfterSeconds: 60 });
    now += 1_500;
    await expect(limiter.hit("login:a", POLICY)).resolves.toEqual({ allowed: false, retryAfterSeconds: 59 });
  });

  it("isolates keys and resets a counter after its window expires", async () => {
    let now = 1_000;
    const limiter = createMemoryRateLimiter({ now: () => now });
    await limiter.hit("login:a", POLICY);
    await limiter.hit("login:a", POLICY);
    await expect(limiter.hit("login:b", POLICY)).resolves.toMatchObject({ allowed: true });
    now += 60_000;
    await expect(limiter.hit("login:a", POLICY)).resolves.toMatchObject({ allowed: true });
    expect(counters().has("login:b")).toBe(false);
  });

  it("shares counters between separately created adapter copies", async () => {
    const first = createMemoryRateLimiter({ now: () => 1_000 });
    const second = createMemoryRateLimiter({ now: () => 1_000 });
    await first.hit("login:a", { maxHits: 1, windowSeconds: 30 });
    await expect(second.hit("login:a", { maxHits: 1, windowSeconds: 30 })).resolves.toMatchObject({ allowed: false });
  });

  it("shares counters across separately loaded module copies", async () => {
    const first = createMemoryRateLimiter({ now: () => 1_000 });
    await first.hit("login:duplicate-bundle", { maxHits: 1, windowSeconds: 30 });
    vi.resetModules();
    const duplicateModule = await import("./memory-rate-limiter.adapter");
    const second = duplicateModule.createMemoryRateLimiter({ now: () => 1_000 });
    await expect(second.hit("login:duplicate-bundle", { maxHits: 1, windowSeconds: 30 })).resolves.toMatchObject({ allowed: false });
  });

  it("refuses new keys at the key cap without evicting active keys", async () => {
    const limiter = createMemoryRateLimiter({ now: () => 1_000, maxKeys: 1 });
    await limiter.hit("login:a", POLICY);
    await expect(limiter.hit("login:b", POLICY)).resolves.toEqual({ allowed: false, retryAfterSeconds: 60 });
    await expect(limiter.hit("login:a", POLICY)).resolves.toMatchObject({ allowed: true });
    expect([...counters().keys()]).toEqual(["login:a"]);
  });

  it("sweeps expired keys before applying the capacity limit", async () => {
    let now = 1_000;
    const limiter = createMemoryRateLimiter({ now: () => now, maxKeys: 1 });
    await limiter.hit("login:a", { maxHits: 1, windowSeconds: 1 });
    now += 1_000;
    await expect(limiter.hit("login:b", POLICY)).resolves.toMatchObject({ allowed: true });
    expect([...counters().keys()]).toEqual(["login:b"]);
  });
});
