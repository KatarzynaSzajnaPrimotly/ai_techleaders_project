import { describe, expect, it } from "vitest";
import { MentorAlreadyExistsError, MentorValidationError } from "./errors";

describe("MentorValidationError", () => {
  it("is an Error with a name and message", () => {
    const error = new MentorValidationError("bad input");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("MentorValidationError");
    expect(error.message).toBe("bad input");
  });
});

describe("MentorAlreadyExistsError", () => {
  it("mentions the email in the message", () => {
    const error = new MentorAlreadyExistsError("ada@example.com");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("MentorAlreadyExistsError");
    expect(error.message).toBe("A mentor with email ada@example.com already exists");
  });
});
