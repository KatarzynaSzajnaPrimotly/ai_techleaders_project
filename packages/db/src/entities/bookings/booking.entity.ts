import { EntitySchema } from "@mikro-orm/core";
import type { Booking } from "@devmentor/core";

export const BookingSchema = new EntitySchema<Booking>({
  name: "Booking",
  tableName: "bookings",
  properties: {
    id: { type: "uuid", primary: true, defaultRaw: "gen_random_uuid()" },
    slotId: { type: "uuid", fieldName: "slot_id" },
    menteeUserId: { type: "uuid", fieldName: "mentee_user_id" },
    mentorProfileId: { type: "uuid", fieldName: "mentor_profile_id" },
    lengthMinutes: { type: "integer", fieldName: "length_minutes" },
    priceCents: { type: "integer", fieldName: "price_cents" },
    currency: { type: "string", length: 3, default: "EUR" },
    status: { type: "string", length: 24 },
    startsAt: { type: "Date", fieldName: "starts_at", columnType: "timestamptz" },
    bookedAt: { type: "Date", fieldName: "booked_at", columnType: "timestamptz", nullable: true },
    expiresAt: { type: "Date", fieldName: "expires_at", columnType: "timestamptz", nullable: true },
    createdAt: { type: "Date", fieldName: "created_at", columnType: "timestamptz", defaultRaw: "now()" },
  },
});
