import { getTrustedClientIp, logger, parseEnv } from "@devmentor/core";

const WARNING_STATE_KEY = "__devmentorWarnedMissingTrustProxyHops";
type GlobalWithWarning = typeof globalThis & { [WARNING_STATE_KEY]?: boolean };

/** Resolves the configured trusted proxy hop and warns once when production omits it. */
export function clientIpForRequest(request: Request): string | null {
  const { NODE_ENV, TRUST_PROXY_HOPS } = parseEnv();
  const globalState = globalThis as GlobalWithWarning;
  if (NODE_ENV === "production" && TRUST_PROXY_HOPS === undefined && !globalState[WARNING_STATE_KEY]) {
    logger.warn("TRUST_PROXY_HOPS is unset in production; IP-based rate limits are disabled");
    globalState[WARNING_STATE_KEY] = true;
  }
  return getTrustedClientIp(request, TRUST_PROXY_HOPS ?? 0);
}
