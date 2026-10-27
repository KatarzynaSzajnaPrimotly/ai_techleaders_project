import { describe, expect, it } from "vitest";
import { confirmSchema } from "./confirm.schema";

describe("confirmSchema", () => {
  it("accepts a valid token and a 72-byte password", () => {
    expect(confirmSchema.parse({ token: "signed-token", password: "p".repeat(72) })).toEqual({
      token: "signed-token",
      password: "p".repeat(72),
    });
  });

  it("counts Unicode code points for the minimum password length", () => {
    expect(confirmSchema.safeParse({ token: "signed-token", password: "😀".repeat(12) }).success).toBe(true);
    expect(confirmSchema.safeParse({ token: "signed-token", password: "😀".repeat(11) }).success).toBe(false);
  });

  it("enforces the bcrypt UTF-8 byte limit for multibyte passwords", () => {
    expect(confirmSchema.safeParse({ token: "signed-token", password: "😀".repeat(18) }).success).toBe(true);
    expect(confirmSchema.safeParse({ token: "signed-token", password: "😀".repeat(19) }).success).toBe(false);
  });

  it.each([
    [{ token: "", password: "a".repeat(12) }, "token"],
    [{ token: "signed-token", password: "short" }, "password"],
    [{ token: 1, password: "a".repeat(12) }, "token"],
    [{ token: "signed-token", password: 1 }, "password"],
  ])("rejects invalid field values", (input, field) => {
    const result = confirmSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
  });

  it("drops unknown fields", () => {
    expect(confirmSchema.parse({ token: "signed-token", password: "a".repeat(12), role: "operator" }))
      .toEqual({ token: "signed-token", password: "a".repeat(12) });
  });
});
