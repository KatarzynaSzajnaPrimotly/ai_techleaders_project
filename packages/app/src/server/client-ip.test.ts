import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@devmentor/core";
import { clientIpForRequest } from "./client-ip";

const WARNING_STATE_KEY = "__devmentorWarnedMissingTrustProxyHops";
type GlobalWithWarning = typeof globalThis & { [WARNING_STATE_KEY]?: boolean };

beforeEach(() => {
  delete (globalThis as GlobalWithWarning)[WARNING_STATE_KEY];
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("clientIpForRequest", () => {
  it("returns null by default without trusting client-supplied forwarding headers", () => {
    delete process.env.TRUST_PROXY_HOPS;
    const request = new Request("http://localhost", { headers: { "x-forwarded-for": "203.0.113.9" } });
    expect(clientIpForRequest(request)).toBeNull();
  });

  it("uses the configured trusted proxy hops", () => {
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    const request = new Request("http://localhost", { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.3" } });
    expect(clientIpForRequest(request)).toBe("10.0.0.3");
  });

  it("warns once in production when TRUST_PROXY_HOPS is unset", () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.TRUST_PROXY_HOPS;
    const warning = vi.spyOn(logger, "warn");
    const request = new Request("http://localhost");
    clientIpForRequest(request);
    clientIpForRequest(request);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning).toHaveBeenCalledWith("TRUST_PROXY_HOPS is unset in production; IP-based rate limits are disabled");
  });

  it("does not warn in development or when production has an explicit value", () => {
    const warning = vi.spyOn(logger, "warn");
    clientIpForRequest(new Request("http://localhost"));
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TRUST_PROXY_HOPS", "1");
    clientIpForRequest(new Request("http://localhost", { headers: { "x-forwarded-for": "10.0.0.1" } }));
    expect(warning).not.toHaveBeenCalled();
  });
});
