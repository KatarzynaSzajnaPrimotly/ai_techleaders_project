import { describe, expect, it } from "vitest";
import * as validators from "./index";

describe("@devmentor/core/validators", () => {
  it("exposes the shared schemas without server-only dependencies", () => {
    expect(validators.mentorCreateSchema.parse({ name: "Ada", email: "a@b.co" })).toEqual({ name: "Ada", email: "a@b.co" });
  });
});
