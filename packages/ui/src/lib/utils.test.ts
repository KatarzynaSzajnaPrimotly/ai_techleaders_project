import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b", { c: true, d: false })).toBe("a b c");
  });

  it("lets later Tailwind classes win over conflicting earlier ones", () => {
    expect(cn("px-4 py-2", "px-8")).toBe("py-2 px-8");
  });
});
