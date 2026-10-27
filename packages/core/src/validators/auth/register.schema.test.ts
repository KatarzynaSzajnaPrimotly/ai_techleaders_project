import { describe, expect, it } from "vitest";
import { registerSchema } from "./register.schema";

describe("registerSchema", () => {
  it("normalizes e-mail and display name and keeps optional returnTo", () => {
    expect(registerSchema.parse({ email: " Ada@Example.COM ", displayName: " Ada Lovelace ", returnTo: "/mentor" })).toEqual({
      email: "ada@example.com",
      displayName: "Ada Lovelace",
      returnTo: "/mentor",
    });
  });

  it("drops unknown fields instead of accepting mass assignment", () => {
    expect(registerSchema.parse({ email: "a@example.test", displayName: "Ada", role: "operator", id: "forced" }))
      .toEqual({ email: "a@example.test", displayName: "Ada" });
  });

  it.each([
    ["an invalid e-mail", { email: "not-an-email", displayName: "Ada" }, "email"],
    ["a too long e-mail", { email: `${"a".repeat(250)}@example.test`, displayName: "Ada" }, "email"],
    ["a blank display name", { email: "a@example.test", displayName: "  " }, "displayName"],
    ["an empty display name", { email: "a@example.test", displayName: "" }, "displayName"],
    ["a too long display name", { email: "a@example.test", displayName: "a".repeat(81) }, "displayName"],
    ["a display name with a newline", { email: "a@example.test", displayName: "Ada\nLovelace" }, "displayName"],
    ["a display name with another control character", { email: "a@example.test", displayName: "Ada\u0085" }, "displayName"],
    ["a display name with a URL", { email: "a@example.test", displayName: "Ada https://example.test" }, "displayName"],
    ["a display name with a bare domain", { email: "a@example.test", displayName: "visit example.test" }, "displayName"],
  ])("rejects %s", (_label, input, field) => {
    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
  });

  it("rejects non-string fields", () => {
    expect(registerSchema.safeParse({ email: 1, displayName: null }).success).toBe(false);
  });
});
