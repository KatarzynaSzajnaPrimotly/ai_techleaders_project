import { describe, expect, it } from "vitest";
import * as core from "./index";

describe("@devmentor/core public API", () => {
  it("exposes the app name", () => {
    expect(core.APP_NAME).toBe("DevMentor");
  });

  it("exposes the service and the domain errors", () => {
    expect(typeof core.MentorService).toBe("function");
    expect(typeof core.MentorValidationError).toBe("function");
    expect(typeof core.MentorAlreadyExistsError).toBe("function");
  });
});
