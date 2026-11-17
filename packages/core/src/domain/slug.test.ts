import { describe, expect, it } from "vitest";
import { RESERVED_SLUGS, slugify, uniqueSlug } from "./slug";

describe("mentor slug helpers", () => {
  it("normalizes accents, punctuation and whitespace", () => {
    expect(slugify("  Áda / Lovelace! ")).toBe("ada-lovelace");
  });

  it("uses a stable fallback when normalization removes everything", () => {
    expect(slugify("你好" )).toBe("mentor");
  });

  it("avoids reserved route names", () => {
    expect(RESERVED_SLUGS.has("api")).toBe(true);
    expect(uniqueSlug("api")).toBe("api-mentor");
  });

  it("adds increasing suffixes without exceeding the slug limit", () => {
    expect(uniqueSlug("ada-lovelace", 0)).toBe("ada-lovelace");
    expect(uniqueSlug("ada-lovelace", 1)).toBe("ada-lovelace-2");
    expect(uniqueSlug("a".repeat(60), 8)).toBe(`${"a".repeat(58)}-9`);
  });
});
