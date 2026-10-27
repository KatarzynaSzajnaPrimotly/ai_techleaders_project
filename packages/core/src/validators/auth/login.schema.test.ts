import { describe, expect, it } from "vitest";
import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
  it("normalizes e-mail and preserves optional returnTo", () => {
    expect(loginSchema.parse({ email: " ADA@Example.COM ", password: "correct horse battery staple", returnTo: "/home" }))
      .toEqual({ email: "ada@example.com", password: "correct horse battery staple", returnTo: "/home" });
  });

  it.each([
    [{ email: "bad", password: "password" }, "email"],
    [{ email: `${"a".repeat(250)}@example.test`, password: "password" }, "email"],
    [{ email: "a@example.test", password: "" }, "password"],
    [{ email: "a@example.test", password: "😀".repeat(19) }, "password"],
    [{ email: 1, password: "password" }, "email"],
    [{ email: "a@example.test", password: 1 }, "password"],
  ])("rejects invalid login input", (input, field) => {
    const result = loginSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
  });

  it("drops unknown fields", () => {
    expect(loginSchema.parse({ email: "a@example.test", password: "password", role: "operator" }))
      .toEqual({ email: "a@example.test", password: "password" });
  });
});
