import { ServiceUnavailableError } from "../../http/errors";
import { parseEnv } from "../../config/env-schema";

export interface PriceBounds {
  p25: { minCents: number; maxCents: number };
  p50: { minCents: number; maxCents: number };
}

export interface PlatformSettings {
  currency: "EUR";
  priceBounds: PriceBounds;
}

export class PlatformSettingsService {
  getOrNull(): PlatformSettings | null {
    const env = parseEnv();
    const values = [env.PRICE_MIN_25_CENTS, env.PRICE_MAX_25_CENTS, env.PRICE_MIN_50_CENTS, env.PRICE_MAX_50_CENTS];
    if (values.some((value) => value === undefined)) return null;
    const [min25, max25, min50, max50] = values as [number, number, number, number];
    if (min25 > max25 || min50 > max50) {
      throw new ServiceUnavailableError("Mentor price bounds are invalid; check the configured minimum and maximum values");
    }
    return { currency: "EUR", priceBounds: { p25: { minCents: min25, maxCents: max25 }, p50: { minCents: min50, maxCents: max50 } } };
  }

  get(): PlatformSettings {
    const settings = this.getOrNull();
    if (!settings) {
      throw new ServiceUnavailableError("Mentor pricing is unavailable; configure all four EUR price bound variables");
    }
    return settings;
  }
}
