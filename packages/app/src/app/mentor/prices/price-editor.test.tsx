import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const apiCall = vi.hoisted(() => vi.fn());
vi.mock("@devmentor/ui", async (importOriginal) => ({ ...(await importOriginal<typeof import("@devmentor/ui")>()), apiCall: apiCall }));

import { MentorPriceEditor } from "./price-editor";

const bounds = { p25: { minCents: 1000, maxCents: 60000 }, p50: { minCents: 18000, maxCents: 120000 } };

describe("MentorPriceEditor", () => {
  it("shows a clear disabled state while founders have not configured price bounds", () => {
    render(<MentorPriceEditor initial={{ prices: null, priceBounds: null }} />);
    expect(screen.getByRole("status").textContent).toContain("Prices are not configured yet");
    expect(screen.queryByRole("button", { name: "Save prices" })).toBeNull();
  });

  it("shows both price bounds and saves both existing EUR prices together", async () => {
    apiCall.mockReset().mockResolvedValue({ ok: true, status: 200, data: { prices: { price25Cents: 2500, price50Cents: 30000, currency: "EUR" } } });
    render(<MentorPriceEditor initial={{ prices: { price25Cents: 2500, price50Cents: 30000, currency: "EUR" }, priceBounds: bounds }} />);
    expect((screen.getByLabelText("25-minute session (EUR)") as HTMLInputElement).value).toBe("25.00");
    expect((screen.getByLabelText("50-minute session (EUR)") as HTMLInputElement).value).toBe("300.00");
    expect(screen.getByText("Allowed range: €10.00–€600.00")).toBeDefined();
    fireEvent.change(screen.getByLabelText("25-minute session (EUR)"), { target: { value: "30.50" } });
    fireEvent.change(screen.getByLabelText("50-minute session (EUR)"), { target: { value: "350" } });
    fireEvent.click(screen.getByRole("button", { name: "Save prices" }));
    await waitFor(() => expect(apiCall).toHaveBeenCalledWith("/api/mentors/me/prices", { method: "PUT", body: { price25: "30.50", price50: "350" } }));
    expect(await screen.findByRole("status")).toBeDefined();
  });

  it("shows returned out-of-bound errors without discarding entered prices", async () => {
    apiCall.mockReset().mockResolvedValue({ ok: false, status: 400, error: { code: "VALIDATION_ERROR", message: "Price is outside the configured bounds", fieldErrors: { price25: ["Enter an amount between €10.00 and €600.00"] } } });
    render(<MentorPriceEditor initial={{ prices: null, priceBounds: bounds }} />);
    fireEvent.change(screen.getByLabelText("25-minute session (EUR)"), { target: { value: "9.99" } });
    fireEvent.change(screen.getByLabelText("50-minute session (EUR)"), { target: { value: "180" } });
    fireEvent.click(screen.getByRole("button", { name: "Save prices" }));
    expect(await screen.findByText("Enter an amount between €10.00 and €600.00")).toBeDefined();
    expect((screen.getByLabelText("25-minute session (EUR)") as HTMLInputElement).value).toBe("9.99");
  });
});
