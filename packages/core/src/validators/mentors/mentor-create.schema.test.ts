import { describe, expect, it } from "vitest";
import { mentorCreateSchema } from "./mentor-create.schema";

describe("mentorCreateSchema", () => {
  it("trims the name and normalises the email", () => {
    expect(mentorCreateSchema.parse({ name: "  Ada Lovelace ", email: " Ada@Example.COM " })).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
  });

  it("drops unknown fields so clients cannot smuggle in id or status (mass assignment)", () => {
    const parsed = mentorCreateSchema.parse({ name: "Ada", email: "a@b.co", id: "x", createdAt: "y", role: "admin" });
    expect(Object.keys(parsed).sort()).toEqual(["email", "name"]);
  });

  it.each([
    ["an empty name", { name: "  ", email: "a@b.co" }, "name", "Name is required"],
    ["a too long name", { name: "n".repeat(121), email: "a@b.co" }, "name", "Name is too long"],
    ["an invalid email", { name: "Ada", email: "nope" }, "email", "Email is invalid"],
    ["a too long email", { name: "Ada", email: `${"e".repeat(250)}@b.co` }, "email", "Email is too long"],
  ])("rejects %s", (_label, input, field, message) => {
    const result = mentorCreateSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field && issue.message === message)).toBe(true);
    }
  });

  it("rejects non-string values", () => {
    expect(mentorCreateSchema.safeParse({ name: 1, email: 2 }).success).toBe(false);
  });
});
