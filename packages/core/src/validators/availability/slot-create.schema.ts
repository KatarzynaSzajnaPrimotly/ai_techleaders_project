import { z } from "zod";

export const slotCreateSchema = z.object({ startsAt: z.string().datetime() }).strict();
export type SlotCreateInput = z.infer<typeof slotCreateSchema>;

export const slotIdSchema = z.uuid();
