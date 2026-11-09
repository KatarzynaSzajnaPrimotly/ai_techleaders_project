import { z } from "zod";

const MAX_EMAIL_LENGTH = 254;
const MAX_DISPLAY_NAME_LENGTH = 80;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/u;
const URL_TEXT = /(?:\b[a-z][a-z0-9+.-]*:\/\/\S+|\bwww\.\S+|\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?)/iu;

const emailSchema = z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH, "Email is too long").pipe(z.email("Email is invalid"));

const displayNameSchema = z.string()
  .min(1, "Display name is required")
  .max(MAX_DISPLAY_NAME_LENGTH, "Display name is too long")
  .refine((value) => value.trim().length > 0, "Display name is required")
  .refine((value) => !CONTROL_CHARACTERS.test(value), "Display name cannot contain control characters")
  .refine((value) => !URL_TEXT.test(value), "Display name cannot contain a URL")
  .transform((value) => value.trim());

export const registerSchema = z.object({
  email: emailSchema,
  displayName: displayNameSchema,
  returnTo: z.string().optional(),
});

export type RegisterInput = z.output<typeof registerSchema>;
