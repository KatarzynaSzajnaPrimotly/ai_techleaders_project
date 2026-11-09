import { describe, expect, it } from "vitest";
import { formatInstant } from "./format-instant";

describe("formatInstant", () => {
  it("formats the instant in UTC by default", () => {
    expect(formatInstant("2026-11-23T12:00:00.000Z")).toBe("November 23, 2026 at 12:00 PM");
  });

  it("formats the same instant in an explicitly selected time zone", () => {
    expect(formatInstant(new Date("2026-11-23T12:00:00.000Z"), "America/Los_Angeles")).toBe("November 23, 2026 at 4:00 AM");
  });

  it("rejects invalid time-zone identifiers", () => {
    expect(() => formatInstant("2026-11-23T12:00:00Z", "Mars/Olympus")).toThrow(RangeError);
  });
});
