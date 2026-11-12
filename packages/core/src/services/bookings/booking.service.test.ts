import { describe, expect, it, vi } from "vitest";
import { ValidationError } from "../../http/errors";
import type { BookingRepositoryPort } from "./booking-repository.port";
import { BookingService } from "./booking.service";

const now = new Date("2026-11-12T12:00:00.000Z");

describe("BookingService", () => {
  it("creates a ten-minute hold using the supplied clock", async () => {
    const repository = { createHold: vi.fn().mockResolvedValue({ id: "booking-1" }) } satisfies BookingRepositoryPort;
    const service = new BookingService({ bookingRepository: repository, now: () => now });
    await expect(service.start("mentee-1", { slotId: "slot-1", lengthMinutes: 25 })).resolves.toEqual({ id: "booking-1" });
    expect(repository.createHold).toHaveBeenCalledWith({
      slotId: "slot-1", menteeUserId: "mentee-1", lengthMinutes: 25,
      now, holdExpiresAt: new Date("2026-11-12T12:10:00.000Z"),
    });
  });

  it.each([0, 24, 30, 50.5])("rejects invalid session length %s before persistence", async (lengthMinutes) => {
    const repository = { createHold: vi.fn() } satisfies BookingRepositoryPort;
    const service = new BookingService({ bookingRepository: repository, now: () => now });
    await expect(service.start("mentee-1", { slotId: "slot-1", lengthMinutes })).rejects.toBeInstanceOf(ValidationError);
    expect(repository.createHold).not.toHaveBeenCalled();
  });
});
