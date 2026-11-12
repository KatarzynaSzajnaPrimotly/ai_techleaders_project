import { beforeEach, describe, expect, it, vi } from "vitest";

const bookingService = vi.hoisted(() => ({ start: vi.fn() }));
vi.mock("../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ bookingService }) }));
vi.mock("../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { dynamic, POST } from "./route";

const SECRET = "e03-booking-route-test-secret-longer-than-32-characters";

async function cookie(role: "mentee" | "mentor") {
  const token = await signSession({ userId: `${role}-1`, role, roles: [role], sessionVersion: 1 }, SECRET);
  return `${SESSION_COOKIE}=${token}`;
}

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  bookingService.start.mockReset().mockResolvedValue({ id: "booking-1", status: "pending_payment" });
});

describe("POST /api/bookings", () => {
  it("is dynamic and starts a booking for an authenticated mentee", async () => {
    expect(dynamic).toBe("force-dynamic");
    const response = await POST(new Request("http://devmentor.test/api/bookings", {
      method: "POST",
      headers: { cookie: await cookie("mentee"), "content-type": "application/json", "x-devmentor-csrf": "1" },
      body: JSON.stringify({ slotId: "5a1a7dc6-0dc5-4e77-a2f4-f01814ee4216", lengthMinutes: 25 }),
    }), undefined);
    expect(response.status).toBe(200);
    expect(bookingService.start).toHaveBeenCalledWith("mentee-1", { slotId: "5a1a7dc6-0dc5-4e77-a2f4-f01814ee4216", lengthMinutes: 25 });
  });

  it("requires CSRF, mentee role and valid input", async () => {
    const body = JSON.stringify({ slotId: "5a1a7dc6-0dc5-4e77-a2f4-f01814ee4216", lengthMinutes: 25 });
    const missingCsrf = await POST(new Request("http://devmentor.test/api/bookings", { method: "POST", headers: { cookie: await cookie("mentee"), "content-type": "application/json" }, body }), undefined);
    const wrongRole = await POST(new Request("http://devmentor.test/api/bookings", { method: "POST", headers: { cookie: await cookie("mentor"), "content-type": "application/json", "x-devmentor-csrf": "1" }, body }), undefined);
    const invalid = await POST(new Request("http://devmentor.test/api/bookings", { method: "POST", headers: { cookie: await cookie("mentee"), "content-type": "application/json", "x-devmentor-csrf": "1" }, body: JSON.stringify({ slotId: "bad", lengthMinutes: 30 }) }), undefined);
    expect(missingCsrf.status).toBe(403);
    expect(wrongRole.status).toBe(403);
    expect(invalid.status).toBe(400);
    expect(bookingService.start).not.toHaveBeenCalled();
  });
});
