/** Creates login keys: per IP+subject and per IP, or subject-only when no trusted IP exists. */
export function loginRateLimitKeys(email: string, clientIp: string | null): string[] {
  const subjectKey = `login:email:${encodeURIComponent(email.toLowerCase())}`;
  if (!clientIp) return [subjectKey];
  return [`login:ip-email:${clientIp}:${encodeURIComponent(email.toLowerCase())}`, `login:ip:${clientIp}`];
}
