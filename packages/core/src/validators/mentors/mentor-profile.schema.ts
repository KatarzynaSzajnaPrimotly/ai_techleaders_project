import { z } from "zod";
import { MENTOR_STACK_TAGS } from "../../services/mentors/mentor-profile.types";
export const mentorProfileUpdateSchema = z.object({
 publicWorkUrl: z.string().url().refine((value) => /^https?:\/\//i.test(value), "Use an HTTP or HTTPS link").optional(),
 bio: z.string().min(1).max(2000).optional(),
 stackTags: z.array(z.enum(MENTOR_STACK_TAGS)).max(4).optional(),
}).strict();
export type MentorProfileUpdate = z.infer<typeof mentorProfileUpdateSchema>;
