import { describe, expect, it } from "vitest";
import { ValidationError } from "../../http/errors";
import { safeReturnTo } from "./safe-return-to";

const APP_URL = "https://devmentor.example";

describe("safeReturnTo", () => {
  it("allows local relative paths and preserves query and fragment", () => {
    expect(safeReturnTo("/mentor/home?tab=upcoming#next", APP_URL)).toBe("/mentor/home?tab=upcoming#next");
  });

  it("normalizes a same-origin absolute URL to a local path", () => {
    expect(safeReturnTo("https://devmentor.example/mentor/home?tab=1", APP_URL)).toBe("/mentor/home?tab=1");
  });

  it.each(["", "\t/home", "/home\r", "/home\n", "/home\u007f", "/home\u0085"])(
    "rejects empty or control-character input (%s)",
    (value) => {
      expect(() => safeReturnTo(value, APP_URL)).toThrowError(
        expect.objectContaining({ name: "ValidationError", status: 400, message: "Invalid returnTo" }),
      );
    },
  );

  it.each([
    "//attacker.example/path",
    "//devmentor.example/path",
    "https://attacker.example/path",
    "http://devmentor.example/path",
    "/sign-in",
    "/sign-in/again",
    "/register",
    "/register/confirm",
    "/registering",
    "/api",
    "/api/auth/logout",
    "/%73ign-in",
    "/%72egister/confirm",
    "/%61pi/auth/logout",
    "/path/%0a",
    "/path/%zz",
  ])("rejects unsafe destination %s", (value) => {
    expect(() => safeReturnTo(value, APP_URL)).toThrowError(ValidationError);
  });

  it("rejects malformed base URLs", () => {
    expect(() => safeReturnTo("/mentor/home", "not a URL")).toThrowError(ValidationError);
    expect(() => safeReturnTo("/mentor/home", "file:///tmp/devmentor")).toThrowError(ValidationError);
  });
});
