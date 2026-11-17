import { z } from "zod";

export const bookingCheckoutSchema = z.object({ bookingId: z.uuid() }).strict();
export type BookingCheckoutInput = z.infer<typeof bookingCheckoutSchema>;
