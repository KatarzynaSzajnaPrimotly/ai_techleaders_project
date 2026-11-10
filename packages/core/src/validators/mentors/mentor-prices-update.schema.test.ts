import { describe, expect, it } from "vitest";
import { mentorPricesUpdateSchema } from "./mentor-prices-update.schema";

describe("mentorPricesUpdateSchema", () => {
  it("accepts two positive exact decimal amounts with at most two decimal places", () => {
    expect(mentorPricesUpdateSchema.parse({ price25: "90", price50: "180.50" })).toEqual({ price25: "90", price50: "180.50" });
  });

  it.each([
    { price25: "0", price50: "180" },
    { price25: "-1", price50: "180" },
    { price25: "90.001", price50: "180" },
    { price25: "text", price50: "180" },
    { price25: "01", price50: "180" },
    { price25: "1e2", price50: "180" },
    { price25: "90071992547409.92", price50: "180" },
    { price25: "90", price50: "180", mentorId: "another mentor" },
  ])("rejects invalid, unsafe, or injected input %#", (input) => {
    expect(mentorPricesUpdateSchema.safeParse(input).success).toBe(false);
  });
});
