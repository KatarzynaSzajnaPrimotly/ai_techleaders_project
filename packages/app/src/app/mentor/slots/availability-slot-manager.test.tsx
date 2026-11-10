import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ apiCall: vi.fn() }));
vi.mock("@devmentor/ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/ui")>();
  return { ...actual, apiCall: mocks.apiCall };
});

import { AvailabilitySlotManager } from "./availability-slot-manager";

beforeEach(() => mocks.apiCall.mockReset());

describe("AvailabilitySlotManager", () => {
  it("shows slots and lets the mentor reveal past times", async () => {
    mocks.apiCall.mockResolvedValue({ ok: true, status: 200, data: [
      { id: "past", startsAt: "2020-01-01T10:00:00.000Z", isPast: true },
      { id: "future", startsAt: "2099-01-01T10:00:00.000Z", isPast: false },
    ] });
    render(<AvailabilitySlotManager />);
    expect(await screen.findByText(/2099/)).toBeDefined();
    expect(screen.queryByText(/2020/)).toBeNull();
    fireEvent.click(screen.getByRole("checkbox", { name: "Show past times" }));
    expect(await screen.findByText(/2020/)).toBeDefined();
    expect(screen.getByText(/Times are shown in/)).toBeDefined();
  });

  it("converts the mentor's local datetime to an ISO instant before publishing", async () => {
    mocks.apiCall
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: { id: "new", startsAt: "2026-11-23T10:00:00.000Z" } })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "new", startsAt: "2026-11-23T10:00:00.000Z", isPast: false }] });
    render(<AvailabilitySlotManager />);
    await screen.findByText("No future times published.");
    fireEvent.change(screen.getByLabelText("Start time"), { target: { value: "2026-11-23T10:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Publish time" }));
    await screen.findByText(/2026/);
    expect(mocks.apiCall).toHaveBeenNthCalledWith(2, "/api/availability/slots", {
      method: "POST", body: { startsAt: new Date("2026-11-23T10:00").toISOString() },
    });
  });
});
