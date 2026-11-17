import { describe, expect, it } from "vitest";
import { BookingSchema } from "../index";

describe("BookingSchema", () => {
  it("maps an owner-scoped EUR booking snapshot with an expiring hold", () => {
    expect(BookingSchema.meta.className).toBe("Booking");
    expect(BookingSchema.meta.tableName).toBe("bookings");
    const properties = BookingSchema.meta.properties;
    expect(Object.keys(properties).sort()).toEqual([
      "bookedAt", "checkoutSessionId", "createdAt", "currency", "expiresAt", "id", "lengthMinutes", "menteeUserId",
      "mentorProfileId", "paymentStatus", "priceCents", "slotId", "startsAt", "status",
    ]);
    expect(properties.id.primary).toBe(true);
    expect(properties.currency.default).toBe("EUR");
    expect(properties.expiresAt.nullable).toBe(true);
    expect(properties.paymentStatus.default).toBe("not_started");
  });
});
