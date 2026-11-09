import { describe, expect, it } from "vitest";
import { homeFor } from "./guards";

describe("homeFor", () => {
  it.each([
    ["mentee", "/home"],
    ["mentor", "/mentor"],
    ["operator", "/admin/mentors"],
  ] as const)("maps %s to its role home", (role, path) => {
    expect(homeFor(role)).toBe(path);
  });
});
