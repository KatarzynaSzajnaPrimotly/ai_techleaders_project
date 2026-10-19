import { describe, expect, it } from "vitest";
import { FEATURED_TUTORS, SUBJECTS } from "./catalog";

describe("catalog", () => {
  it("lists unique subjects", () => {
    expect(SUBJECTS.length).toBeGreaterThan(0);
    expect(new Set(SUBJECTS).size).toBe(SUBJECTS.length);
  });

  it("features tutors with unique ids and valid figures", () => {
    expect(new Set(FEATURED_TUTORS.map((tutor) => tutor.id)).size).toBe(FEATURED_TUTORS.length);
    for (const tutor of FEATURED_TUTORS) {
      expect(tutor.name, tutor.id).not.toBe("");
      expect(tutor.pricePerHour, tutor.id).toBeGreaterThan(0);
      expect(tutor.rating, tutor.id).toBeGreaterThanOrEqual(0);
      expect(tutor.rating, tutor.id).toBeLessThanOrEqual(5);
      expect(tutor.reviewCount, tutor.id).toBeGreaterThanOrEqual(0);
    }
  });

  it("only teaches subjects that exist in the subject list", () => {
    for (const tutor of FEATURED_TUTORS) {
      for (const subject of tutor.subjects) expect(SUBJECTS, tutor.id).toContain(subject);
    }
  });
});
