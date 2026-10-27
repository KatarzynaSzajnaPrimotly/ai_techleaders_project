import { z } from "zod";

const MIN_PASSWORD_CHARACTERS = 12;
const MAX_PASSWORD_BYTES = 72;

function utf8Length(value: string): number {
  return new TextEncoder().encode(value).length;
}

export const confirmSchema = z.object({
  token: z.string().min(1, "Registration token is required"),
  password: z.string()
    .refine((value) => Array.from(value).length >= MIN_PASSWORD_CHARACTERS, "Password must be at least 12 characters")
    .refine((value) => utf8Length(value) <= MAX_PASSWORD_BYTES, "Password must be at most 72 UTF-8 bytes"),
});

export type ConfirmInput = z.output<typeof confirmSchema>;
