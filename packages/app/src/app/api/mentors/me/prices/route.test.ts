import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({ priceConfiguration: vi.fn(), updatePrices: vi.fn() }));
vi.mock("../../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: service }) }));
vi.mock("../../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { dynamic, GET, PUT } from "./route";

const SECRET = "e02-mentor-prices-route-secret-at-least-32-characters";
const configuration = { prices: null, priceBounds: null };

async function cookie(role: "mentor" | "mentee" = "mentor") {
  const token = await signSession({ userId: "mentor-1", role, roles: [role], sessionVersion: 1 }, SECRET);
  return `${SESSION_COOKIE}=${token}`;
}

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  service.priceConfiguration.mockReset().mockResolvedValue(configuration);
  service.updatePrices.mockReset().mockResolvedValue({ prices: { price25Cents: 2500, price50Cents: 5000, currency: "EUR" } });
});
afterEach(() => vi.unstubAllEnvs());

describe("/api/mentors/me/prices", () => {
  it("returns prices and current bounds to the signed-in mentor", async () => {
    expect(dynamic).toBe("force-dynamic");
    const response = await GET(new Request("http://devmentor.test/api/mentors/me/prices", { headers: { cookie: await cookie() } }), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: configuration });
    expect(service.priceConfiguration).toHaveBeenCalledWith("mentor-1");
  });

  it("requires mentor access and CSRF for updates", async () => {
    const mentee = await cookie("mentee");
    const denied = await PUT(new Request("http://devmentor.test/api/mentors/me/prices", { method: "PUT", headers: { cookie: mentee, "content-type": "application/json", "x-devmentor-csrf": "1" }, body: JSON.stringify({ price25: "25", price50: "50" }) }), undefined);
    expect(denied.status).toBe(403);
    const noCsrf = await PUT(new Request("http://devmentor.test/api/mentors/me/prices", { method: "PUT", headers: { cookie: await cookie(), "content-type": "application/json" }, body: JSON.stringify({ price25: "25", price50: "50" }) }), undefined);
    expect(noCsrf.status).toBe(403);
    expect(service.updatePrices).not.toHaveBeenCalled();
  });

  it("validates both exact decimal prices and uses only the authenticated owner", async () => {
    const headers = { cookie: await cookie(), "content-type": "application/json", "x-devmentor-csrf": "1" };
    const invalid = await PUT(new Request("http://devmentor.test/api/mentors/me/prices", { method: "PUT", headers, body: JSON.stringify({ price25: "1.234", price50: "50", mentorId: "other" }) }), undefined);
    expect(invalid.status).toBe(400);
    expect(service.updatePrices).not.toHaveBeenCalled();
    const response = await PUT(new Request("http://devmentor.test/api/mentors/me/prices", { method: "PUT", headers, body: JSON.stringify({ price25: "25.50", price50: "50" }) }), undefined);
    expect(response.status).toBe(200);
    expect(service.updatePrices).toHaveBeenCalledWith("mentor-1", { price25: "25.50", price50: "50" });
  });
});
