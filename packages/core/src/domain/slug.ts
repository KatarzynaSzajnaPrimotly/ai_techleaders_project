const MAX_SLUG_LENGTH = 60;

export const RESERVED_SLUGS = new Set([
  "admin", "api", "m", "mentor", "mentors", "operator", "sign-in", "sign-out", "register",
]);

export function slugify(value: string): string {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "mentor";
}

export function uniqueSlug(base: string, attempt = 0): string {
  const safeBase = RESERVED_SLUGS.has(base) ? `${base}-mentor` : base;
  const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
  return `${safeBase.slice(0, MAX_SLUG_LENGTH - suffix.length).replace(/-+$/g, "")}${suffix}`;
}
