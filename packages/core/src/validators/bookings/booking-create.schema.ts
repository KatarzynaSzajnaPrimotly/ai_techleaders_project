import { z } from "zod";

export const bookingCreateSchema = z.object({
  slotId: z.uuid(),
  lengthMinutes: z.union([z.literal(25), z.literal(50)]),
}).strict();

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
