import { describe, expect, it } from "vitest";
import { loginRateLimitKeys } from "./rate-limit-keys";
import { createMemoryRateLimiter } from "./memory-rate-limiter.adapter";

describe("loginRateLimitKeys", () => {
  it("uses normalized email only when there is no trusted client IP", () => {
    expect(loginRateLimitKeys("Marta+Mentor@example.test", null)).toEqual([
      "login:email:marta%2Bmentor%40example.test",
    ]);
  });

  it("applies both the per-subject and per-IP limits when an IP is trusted", () => {
    expect(loginRateLimitKeys("marta@example.test", "2001:db8::1")).toEqual([
      "login:ip-email:2001:db8::1:marta%40example.test",
      "login:ip:2001:db8::1",
    ]);
  });

  it("keeps the per-IP bucket stable across client-supplied leftmost forwarded values", () => {
    const first = loginRateLimitKeys("one@example.test", "10.0.0.4");
    const second = loginRateLimitKeys("two@example.test", "10.0.0.4");
    expect(first[1]).toBe(second[1]);
  });

  it("applies a shared IP limit across different login subjects", async () => {
    const limiter = createMemoryRateLimiter({ now: () => 1_000 });
    const firstIpKey = loginRateLimitKeys("one@example.test", "10.0.0.5")[1];
    const secondIpKey = loginRateLimitKeys("two@example.test", "10.0.0.5")[1];
    const policy = { maxHits: 1, windowSeconds: 30 };
    await limiter.hit(firstIpKey, policy);
    await expect(limiter.hit(secondIpKey, policy)).resolves.toMatchObject({ allowed: false });
  });
});
