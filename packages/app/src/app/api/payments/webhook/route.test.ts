import { beforeEach, describe, expect, it, vi } from "vitest";
const service = vi.hoisted(() => ({ handleWebhook: vi.fn() }));
vi.mock("../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ bookingPaymentService: service }) }));

import { POST } from "./route";

beforeEach(() => service.handleWebhook.mockReset().mockResolvedValue({ processed: true, outcome: "confirmed" }));

describe("POST /api/payments/webhook", () => {
  it("passes the raw body and signature to the verifier", async () => {
    const response = await POST(new Request("http://devmentor.test/api/payments/webhook", {
      method: "POST", headers: { "x-devmentor-payment-signature": "signed-value" }, body: "raw-event",
    }), undefined);
    expect(response.status).toBe(200);
    expect(service.handleWebhook).toHaveBeenCalledWith("raw-event", "signed-value");
  });

  it("rejects a missing signature before processing", async () => {
    const response = await POST(new Request("http://devmentor.test/api/payments/webhook", { method: "POST", body: "raw-event" }), undefined);
    expect(response.status).toBe(400);
    expect(service.handleWebhook).not.toHaveBeenCalled();
  });
});
