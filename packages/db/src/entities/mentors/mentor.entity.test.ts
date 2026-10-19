import { describe, expect, it } from "vitest";
import { MentorSchema } from "../index";

describe("MentorSchema", () => {
  it("maps Mentor to the mentors table", () => {
    expect(MentorSchema.meta.className).toBe("Mentor");
    expect(MentorSchema.meta.tableName).toBe("mentors");
  });

  it("declares the expected properties", () => {
    const properties = MentorSchema.meta.properties;
    expect(Object.keys(properties).sort()).toEqual(["createdAt", "email", "id", "name"]);
    expect(properties.id.primary).toBe(true);
    expect(properties.email.unique).toBe(true);
  });
});
