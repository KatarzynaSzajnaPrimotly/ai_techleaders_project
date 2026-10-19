import { z } from "zod";

const MAX_NAME_LENGTH = 120;
// RFC 5321 limit for a mailbox address.
const MAX_EMAIL_LENGTH = 254;

export const mentorCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(MAX_NAME_LENGTH, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(MAX_EMAIL_LENGTH, "Email is too long")
    .pipe(z.email("Email is invalid")),
});

export type MentorCreateInput = z.output<typeof mentorCreateSchema>;
