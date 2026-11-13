import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({ listForMentor: vi.fn(), publish: vi.fn() }));
vi.mock("../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ availabilityService: service }) }));
vi.mock("../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { dynamic, GET, POST } from "./route";

const SECRET = "e02-availability-slots-route-secret-at-least-32-characters";
const start = "2026-11-23T18:00:00.000Z";

async function cookie(role: "mentor" | "mentee" = "mentor") {
  const token = await signSession({ userId: "owner-1", role, roles: [role], sessionVersion: 1 }, SECRET);
  return `${SESSION_COOKIE}=${token}`;
}

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  service.listForMentor.mockReset().mockResolvedValue([{ id: "slot-1", startsAt: start, isPast: false }]);
  service.publish.mockReset().mockResolvedValue({ id: "slot-2", startsAt: start });
});
afterEach(() => vi.unstubAllEnvs());

describe("/api/availability/slots", () => {
  it("lists only the current mentor's slots", async () => {
    expect(dynamic).toBe("force-dynamic");
    const response = await GET(new Request("http://devmentor.test/api/availability/slots", { headers: { cookie: await cookie() } }), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ data: [{ id: "slot-1" }] });
    expect(service.listForMentor).toHaveBeenCalledWith("owner-1");
  });

  it("requires mentor access and CSRF for publishing", async () => {
    const mentee = await cookie("mentee");
    const denied = await POST(new Request("http://devmentor.test/api/availability/slots", { method: "POST", headers: { cookie: mentee, "content-type": "application/json", "x-devmentor-csrf": "1" }, body: JSON.stringify({ startsAt: start }) }), undefined);
    expect(denied.status).toBe(403);
    const csrfMissing = await POST(new Request("http://devmentor.test/api/availability/slots", { method: "POST", headers: { cookie: await cookie(), "content-type": "application/json" }, body: JSON.stringify({ startsAt: start }) }), undefined);
    expect(csrfMissing.status).toBe(403);
    expect(service.publish).not.toHaveBeenCalled();
  });

  it("validates the timestamp shape and publishes against the signed-in owner", async () => {
    const headers = { cookie: await cookie(), "content-type": "application/json", "x-devmentor-csrf": "1" };
    const invalid = await POST(new Request("http://devmentor.test/api/availability/slots", { method: "POST", headers, body: JSON.stringify({ startsAt: "yesterday" }) }), undefined);
    expect(invalid.status).toBe(400);
    expect(service.publish).not.toHaveBeenCalled();
    const response = await POST(new Request("http://devmentor.test/api/availability/slots", { method: "POST", headers, body: JSON.stringify({ startsAt: start }) }), undefined);
    expect(response.status).toBe(200);
    expect(service.publish).toHaveBeenCalledWith("owner-1", start);
  });
});
