import { describe, expect, it } from "vitest";
import * as validators from "./index";

describe("@devmentor/core/validators", () => {
  it("exposes the shared schemas without server-only dependencies", () => {
    expect(validators.mentorCreateSchema.parse({ name: "Ada", email: "a@b.co" })).toEqual({ name: "Ada", email: "a@b.co" });
    expect(validators.safeReturnTo("/mentor/home", "https://devmentor.example")).toBe("/mentor/home");
    expect(validators.registerSchema.parse({ email: "ADA@example.test", displayName: "Ada" })).toEqual({
      email: "ada@example.test",
      displayName: "Ada",
    });
    expect(validators.confirmSchema.parse({ token: "signed", password: "a".repeat(12) }).token).toBe("signed");
    expect(validators.loginSchema.parse({ email: "ada@example.test", password: "password" }).email).toBe("ada@example.test");
  });
});
