import { describe, expect, it, vi } from "vitest";
import { ConflictError, NotFoundError, ValidationError } from "@devmentor/core";
import { createBookingRepository } from "./booking.repository";

const now = new Date("2026-11-12T12:00:00.000Z");
const slot = { id: "slot-1", mentorProfileId: "profile-1", startsAt: new Date("2026-11-12T16:00:00.000Z"), removedAt: null, createdAt: now };
const profile = { id: "profile-1", price25Cents: 5000, price50Cents: 9000, publishedAt: now };
const booking = { id: "booking-1", slotId: "slot-1", menteeUserId: "mentee-1", mentorProfileId: "profile-1", lengthMinutes: 25, priceCents: 5000, currency: "EUR", status: "pending_payment", startsAt: slot.startsAt, bookedAt: null, expiresAt: new Date(now.getTime() + 600_000), checkoutSessionId: null, paymentStatus: "not_started", createdAt: now };

function setup(options: { slot?: unknown; profile?: unknown; active?: unknown; inserted?: unknown; flushError?: unknown } = {}) {
  const created = { ...booking };
  const tx = {
    findOne: vi.fn().mockImplementation(async (entity: string) => entity === "Slot" ? (options.slot === undefined ? slot : options.slot) : entity === "MentorProfile" ? (options.profile === undefined ? profile : options.profile) : (options.active ?? null)),
    nativeUpdate: vi.fn().mockResolvedValue(1),
    create: vi.fn().mockReturnValue(created),
    flush: vi.fn().mockImplementation(async () => { if (options.flushError) throw options.flushError; }),
    execute: vi.fn().mockResolvedValue(options.inserted === undefined ? [{ event_id: "event-1" }] : options.inserted),
  };
  const em = { transactional: vi.fn((run: (manager: typeof tx) => unknown) => run(tx)), ...tx };
  return { repository: createBookingRepository(em as never), em, tx, created };
}

describe("booking repository", () => {
  it("creates a priced hold transactionally", async () => {
    const { repository, tx, created } = setup();
    await expect(repository.createHold({ slotId: "slot-1", menteeUserId: "mentee-1", lengthMinutes: 25, now, holdExpiresAt: new Date(now.getTime() + 600_000) })).resolves.toBe(created);
    expect(tx.nativeUpdate).toHaveBeenCalledWith("Booking", expect.objectContaining({ status: "pending_payment" }), { status: "expired" });
    expect(tx.create).toHaveBeenCalledWith("Booking", expect.objectContaining({ priceCents: 5000, currency: "EUR" }));
    const fifty = setup();
    await fifty.repository.createHold({ slotId: "slot-1", menteeUserId: "mentee-1", lengthMinutes: 50, now, holdExpiresAt: new Date(now.getTime() + 600_000) });
    expect(fifty.tx.create).toHaveBeenCalledWith("Booking", expect.objectContaining({ priceCents: 9000, lengthMinutes: 50 }));
  });

  it("rejects missing or removed slots, too-soon slots, unavailable mentors and unpriced lengths", async () => {
    const missing = setup({ slot: null });
    await expect(missing.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(NotFoundError);
    const removed = setup({ slot: { ...slot, removedAt: now } });
    await expect(removed.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(NotFoundError);
    const soon = setup({ slot: { ...slot, startsAt: new Date(now.getTime() + 119 * 60_000) } });
    await expect(soon.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(ValidationError);
    const unpublished = setup({ profile: null });
    await expect(unpublished.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(ValidationError);
    const unpriced = setup({ profile: { ...profile, price25Cents: null } });
    await expect(unpriced.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects an active hold and translates the unique index race", async () => {
    const active = setup({ active: booking });
    await expect(active.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(ConflictError);
    const unique = setup({ flushError: { code: "23505", constraint: "bookings_active_slot_unique" } });
    await expect(unique.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toBeInstanceOf(ConflictError);
    const unknown = setup({ flushError: new Error("database failure") });
    await expect(unknown.repository.createHold({ slotId: "x", menteeUserId: "m", lengthMinutes: 25, now, holdExpiresAt: now })).rejects.toThrow("database failure");
  });

  it("looks up an owned pending booking and attaches exactly one checkout session", async () => {
    const { repository, tx } = setup();
    tx.findOne.mockResolvedValueOnce(booking);
    await expect(repository.findPendingOwned("booking-1", "mentee-1")).resolves.toBe(booking);
    tx.findOne.mockResolvedValueOnce(null);
    await expect(repository.findPendingOwned("missing", "mentee-1")).rejects.toBeInstanceOf(NotFoundError);
    await expect(repository.attachCheckoutSession("booking-1", "session-1")).resolves.toBeUndefined();
    tx.nativeUpdate.mockResolvedValueOnce(0);
    await expect(repository.attachCheckoutSession("booking-1", "session-2")).rejects.toBeInstanceOf(ConflictError);
  });

  it("deduplicates payment events and handles confirmed, expired, mismatched and ignored payments", async () => {
    const event = { id: "event-1", checkoutSessionId: "session-1", amountCents: 5000, currency: "EUR" as const };
    const duplicate = setup({ inserted: [] });
    await expect(duplicate.repository.settlePayment(event, now)).resolves.toBe("ignored");
    const notFound = setup({ inserted: [{ event_id: "e" }], active: null });
    notFound.tx.findOne.mockResolvedValueOnce(null);
    await expect(notFound.repository.settlePayment(event, now)).resolves.toBe("ignored");
    const wrongAmount = setup({ inserted: [{ event_id: "e" }], active: { ...booking, checkoutSessionId: "session-1" } });
    wrongAmount.tx.findOne.mockResolvedValueOnce({ ...booking, checkoutSessionId: "session-1", priceCents: 1, paymentStatus: "checkout_open" });
    await expect(wrongAmount.repository.settlePayment(event, now)).resolves.toBe("refund");
    const expired = setup();
    expired.tx.findOne.mockResolvedValueOnce({ ...booking, checkoutSessionId: "session-1", expiresAt: new Date(now.getTime() - 1), paymentStatus: "checkout_open" });
    await expect(expired.repository.settlePayment(event, now)).resolves.toBe("refund");
    const paid = setup();
    paid.tx.findOne.mockResolvedValueOnce({ ...booking, checkoutSessionId: "session-1", paymentStatus: "paid" });
    await expect(paid.repository.settlePayment(event, now)).resolves.toBe("ignored");
    const success = setup();
    const paidBooking = { ...booking, checkoutSessionId: "session-1", paymentStatus: "checkout_open" };
    success.tx.findOne.mockResolvedValueOnce(paidBooking);
    await expect(success.repository.settlePayment(event, now)).resolves.toBe("confirmed");
    expect(paidBooking.status).toBe("confirmed");
    expect(paidBooking.paymentStatus).toBe("paid");
  });

  it("marks a pending refund complete", async () => {
    const { repository, em } = setup();
    await expect(repository.markRefunded("session-1")).resolves.toBeUndefined();
    expect(em.nativeUpdate).toHaveBeenCalledWith("Booking", { checkoutSessionId: "session-1", paymentStatus: "refund_pending" }, { paymentStatus: "refunded" });
  });
});
