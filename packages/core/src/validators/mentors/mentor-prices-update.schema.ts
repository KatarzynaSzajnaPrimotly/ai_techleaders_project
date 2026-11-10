import { z } from "zod";

const exactMajorDecimal = z.string().max(18).regex(/^(0|[1-9]\d*)(\.\d{1,2})?$/).refine((value) => {
  const [major, minor = ""] = value.split(".");
  const cents = Number(major) * 100 + Number(minor.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0;
}, "Enter a positive safe amount with up to two decimal places");

export const mentorPricesUpdateSchema = z.object({
  price25: exactMajorDecimal,
  price50: exactMajorDecimal,
}).strict();

export type MentorPricesUpdateInput = z.infer<typeof mentorPricesUpdateSchema>;
