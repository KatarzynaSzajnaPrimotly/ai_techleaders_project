import { z } from "zod";

const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_BYTES = 72;

const emailSchema = z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH, "Email is too long").pipe(z.email("Email is invalid"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").refine(
    (value) => new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES,
    "Password must be at most 72 UTF-8 bytes",
  ),
  returnTo: z.string().optional(),
});

export type LoginInput = z.output<typeof loginSchema>;
