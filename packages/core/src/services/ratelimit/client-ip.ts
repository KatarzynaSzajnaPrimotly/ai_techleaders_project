import { isIP } from "node:net";

/** Returns the trusted proxy hop selected from the right, or null when no hop is trusted. */
export function getTrustedClientIp(request: Request, trustProxyHops: number): string | null {
  if (!Number.isInteger(trustProxyHops) || trustProxyHops <= 0) return null;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!forwardedFor) return null;

  const entries = forwardedFor.split(",").map((entry) => entry.trim());
  if (entries.length < trustProxyHops) return null;
  const candidate = entries[entries.length - trustProxyHops];
  return candidate && isIP(candidate) !== 0 ? candidate : null;
}
