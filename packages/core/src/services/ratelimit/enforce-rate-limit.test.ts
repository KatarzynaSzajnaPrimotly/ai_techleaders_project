import { describe, expect, it, vi } from "vitest";
import { TooManyRequestsError } from "../../http/errors";
import { enforceRateLimit } from "./enforce-rate-limit";

describe("enforceRateLimit", () => {
  it("returns when the limiter allows the request", async () => {
    const rateLimiter = { hit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }) };
    await expect(enforceRateLimit(rateLimiter, "login:user", { maxHits: 3, windowSeconds: 60 })).resolves.toBeUndefined();
    expect(rateLimiter.hit).toHaveBeenCalledWith("login:user", { maxHits: 3, windowSeconds: 60 });
  });

  it("throws TooManyRequestsError with the limiter retry delay when refused", async () => {
    const rateLimiter = { hit: vi.fn().mockResolvedValue({ allowed: false, retryAfterSeconds: 13 }) };
    await expect(enforceRateLimit(rateLimiter, "login:user", { maxHits: 3, windowSeconds: 60 })).rejects.toEqual(
      expect.objectContaining({ name: TooManyRequestsError.name, status: 429, retryAfterSeconds: 13 }),
    );
  });
});
