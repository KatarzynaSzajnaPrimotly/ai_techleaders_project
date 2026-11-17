import { beforeEach, describe, expect, it, vi } from "vitest";
const service = vi.hoisted(() => ({ createCheckout: vi.fn() }));
vi.mock("../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ bookingPaymentService: service }) }));
vi.mock("../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { POST } from "./route";

const secret = "checkout-route-test-secret-longer-than-32-characters";
async function cookie(role: "mentee" | "mentor") {
  const token = await signSession({ userId: `${role}-1`, role, roles: [role], sessionVersion: 1 }, secret);
  return `${SESSION_COOKIE}=${token}`;
}

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", secret);
  service.createCheckout.mockReset().mockResolvedValue({ checkoutUrl: "https://payments.test/checkout" });
});

describe("POST /api/bookings/checkout", () => {
  it("creates checkout for an authenticated mentee", async () => {
    const response = await POST(new Request("http://devmentor.test/api/bookings/checkout", {
      method: "POST", headers: { cookie: await cookie("mentee"), "content-type": "application/json", "x-devmentor-csrf": "1" },
      body: JSON.stringify({ bookingId: "5a1a7dc6-0dc5-4e77-a2f4-f01814ee4216" }),
    }), undefined);
    expect(response.status).toBe(200);
    expect(service.createCheckout).toHaveBeenCalledWith("mentee-1", "5a1a7dc6-0dc5-4e77-a2f4-f01814ee4216");
  });

  it("rejects missing CSRF, wrong role, and invalid booking id", async () => {
    const body = JSON.stringify({ bookingId: "5a1a7dc6-0dc5-4e77-a2f4-f01814ee4216" });
    const missing = await POST(new Request("http://devmentor.test/api/bookings/checkout", { method: "POST", headers: { cookie: await cookie("mentee"), "content-type": "application/json" }, body }), undefined);
    const wrongRole = await POST(new Request("http://devmentor.test/api/bookings/checkout", { method: "POST", headers: { cookie: await cookie("mentor"), "content-type": "application/json", "x-devmentor-csrf": "1" }, body }), undefined);
    const invalid = await POST(new Request("http://devmentor.test/api/bookings/checkout", { method: "POST", headers: { cookie: await cookie("mentee"), "content-type": "application/json", "x-devmentor-csrf": "1" }, body: JSON.stringify({ bookingId: "bad" }) }), undefined);
    expect(missing.status).toBe(403);
    expect(wrongRole.status).toBe(403);
    expect(invalid.status).toBe(400);
    expect(service.createCheckout).not.toHaveBeenCalled();
  });
});
