import { ValidationError } from "../http/errors";

export const PLATFORM_CURRENCY = "EUR" as const;

const MAJOR_AMOUNT_PATTERN = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

export function majorAmountToCents(value: string): number {
  if (!MAJOR_AMOUNT_PATTERN.test(value)) {
    throw new ValidationError("Enter an amount with up to two decimal places", { price: ["Enter an amount with up to two decimal places"] });
  }
  const [major, minor = ""] = value.split(".");
  const cents = Number(major) * 100 + Number(minor.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents)) {
    throw new ValidationError("Enter a smaller amount", { price: ["Enter a smaller amount"] });
  }
  return cents;
}

export function centsToMajorAmount(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error("Cents must be a non-negative safe integer");
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}
