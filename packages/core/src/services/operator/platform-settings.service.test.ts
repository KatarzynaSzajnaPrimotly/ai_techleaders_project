import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceUnavailableError } from "../../http/errors";
import { PlatformSettingsService } from "./platform-settings.service";

afterEach(() => vi.unstubAllEnvs());

describe("PlatformSettingsService", () => {
  it("returns EUR bounds from all four configured integer cent values", () => {
    vi.stubEnv("PRICE_MIN_25_CENTS", "1000");
    vi.stubEnv("PRICE_MAX_25_CENTS", "60000");
    vi.stubEnv("PRICE_MIN_50_CENTS", "18000");
    vi.stubEnv("PRICE_MAX_50_CENTS", "120000");
    expect(new PlatformSettingsService().get()).toEqual({
      currency: "EUR",
      priceBounds: { p25: { minCents: 1000, maxCents: 60000 }, p50: { minCents: 18000, maxCents: 120000 } },
    });
  });

  it("fails closed when any bound is missing", () => {
    vi.stubEnv("PRICE_MIN_25_CENTS", "1000");
    expect(() => new PlatformSettingsService().get()).toThrow(ServiceUnavailableError);
    expect(new PlatformSettingsService().getOrNull()).toBeNull();
  });

  it("rejects malformed or unsafe numeric configuration", () => {
    vi.stubEnv("PRICE_MIN_25_CENTS", "1.50");
    expect(() => new PlatformSettingsService().getOrNull()).toThrow("Invalid environment variables: PRICE_MIN_25_CENTS");
  });

  it("rejects a minimum greater than its maximum", () => {
    vi.stubEnv("PRICE_MIN_25_CENTS", "200");
    vi.stubEnv("PRICE_MAX_25_CENTS", "100");
    vi.stubEnv("PRICE_MIN_50_CENTS", "100");
    vi.stubEnv("PRICE_MAX_50_CENTS", "200");
    expect(() => new PlatformSettingsService().get()).toThrow(ServiceUnavailableError);
  });
});
