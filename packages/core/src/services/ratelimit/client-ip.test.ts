import { describe, expect, it } from "vitest";
import { getTrustedClientIp } from "./client-ip";
import { loginRateLimitKeys } from "./rate-limit-keys";

describe("getTrustedClientIp", () => {
  it.each([0, -1, 1.5])("does not trust a proxy chain with hop setting %s", (hops) => {
    const request = new Request("http://localhost", { headers: { "x-forwarded-for": "192.0.2.5, 10.0.0.1" } });
    expect(getTrustedClientIp(request, hops)).toBeNull();
  });

  it("returns null when the header is absent or shorter than the configured hops", () => {
    expect(getTrustedClientIp(new Request("http://localhost"), 1)).toBeNull();
    const short = new Request("http://localhost", { headers: { "x-forwarded-for": "192.0.2.5" } });
    expect(getTrustedClientIp(short, 2)).toBeNull();
  });

  it("selects the configured entry counting from the right, ignoring client-controlled left entries", () => {
    const request = new Request("http://localhost", { headers: { "x-forwarded-for": "198.51.100.77, 192.0.2.9, 10.0.0.4" } });
    expect(getTrustedClientIp(request, 1)).toBe("10.0.0.4");
    expect(getTrustedClientIp(request, 2)).toBe("192.0.2.9");
  });

  it("does not let a client-controlled leftmost value create a fresh IP bucket", () => {
    const first = new Request("http://localhost", { headers: { "x-forwarded-for": "198.51.100.70, 10.0.0.4" } });
    const second = new Request("http://localhost", { headers: { "x-forwarded-for": "203.0.113.99, 10.0.0.4" } });
    const firstKeys = loginRateLimitKeys("one@example.test", getTrustedClientIp(first, 1));
    const secondKeys = loginRateLimitKeys("two@example.test", getTrustedClientIp(second, 1));
    expect(firstKeys[1]).toBe(secondKeys[1]);
  });

  it("accepts valid IPv6 and rejects malformed selected entries", () => {
    expect(getTrustedClientIp(new Request("http://localhost", { headers: { "x-forwarded-for": "2001:db8::2" } }), 1)).toBe("2001:db8::2");
    expect(getTrustedClientIp(new Request("http://localhost", { headers: { "x-forwarded-for": "not-an-ip" } }), 1)).toBeNull();
  });
});
