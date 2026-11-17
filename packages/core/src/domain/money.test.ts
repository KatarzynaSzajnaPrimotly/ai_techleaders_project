import { describe, expect, it } from "vitest";
import { centsToMajorAmount, majorAmountToCents } from "./money";

describe("money helpers", () => {
  it.each([["1", 100], ["1.2", 120], ["1.23", 123], ["0.01", 1], ["90071992547409.91", Number.MAX_SAFE_INTEGER]])(
    "converts exact major-unit amount %s to integer cents",
    (amount, cents) => expect(majorAmountToCents(amount)).toBe(cents),
  );

  it.each(["", "-1", ".50", "01.00", "1.234", "1e2", "90071992547409.92"])(
    "rejects invalid or unsafe amount %s",
    (amount) => expect(() => majorAmountToCents(amount)).toThrow(),
  );

  it.each([[0, "0.00"], [1, "0.01"], [100, "1.00"], [12345, "123.45"]])(
    "formats integer cents %i exactly",
    (cents, amount) => expect(centsToMajorAmount(cents)).toBe(amount),
  );

  it.each([-1, Number.NaN])("rejects invalid cents %s", (cents) => {
    expect(() => centsToMajorAmount(cents)).toThrow("Cents must be a non-negative safe integer");
  });
});
