import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ apiCall: vi.fn() }));
vi.mock("@devmentor/ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/ui")>();
  return { ...actual, apiCall: mocks.apiCall };
});

import { AvailabilitySlotManager } from "./availability-slot-manager";

beforeEach(() => mocks.apiCall.mockReset());
afterEach(() => vi.restoreAllMocks());

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

  it("removes a published time and reloads the list", async () => {
    mocks.apiCall
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "slot-1", startsAt: "2099-01-01T10:00:00.000Z", isPast: false }] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: { id: "slot-1" } })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] });
    render(<AvailabilitySlotManager />);
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }));
    await screen.findByText("No future times published.");
    expect(mocks.apiCall).toHaveBeenNthCalledWith(2, "/api/availability/slots/slot-1", { method: "DELETE" });
    expect(mocks.apiCall).toHaveBeenCalledTimes(3);
  });

  it("keeps the time visible and shows the error when removal is refused", async () => {
    mocks.apiCall
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "slot-1", startsAt: "2099-01-01T10:00:00.000Z", isPast: false }] })
      .mockResolvedValueOnce({ ok: false, status: 409, error: { code: "CONFLICT", message: "A booked time cannot be removed" } });
    render(<AvailabilitySlotManager />);
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }));
    expect((await screen.findByRole("alert")).textContent).toContain("A booked time cannot be removed");
    expect(screen.getByRole("button", { name: "Remove" })).toBeDefined();
  });

  it("retries when loading the existing slots fails", async () => {
    mocks.apiCall
      .mockResolvedValueOnce({ ok: false, status: 503, error: { code: "SERVICE_UNAVAILABLE", message: "Try again" } })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "slot-1", startsAt: "2099-01-01T10:00:00.000Z", isPast: false }] });
    render(<AvailabilitySlotManager />);
    fireEvent.click(await screen.findByRole("button", { name: "Retry" }));
    expect(await screen.findByRole("button", { name: "Remove" })).toBeDefined();
    expect(mocks.apiCall).toHaveBeenCalledTimes(2);
  });

  it("falls back to UTC when the browser reports no time zone", async () => {
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: "" } as Intl.ResolvedDateTimeFormatOptions);
    mocks.apiCall.mockResolvedValue({ ok: true, status: 200, data: [] });
    render(<AvailabilitySlotManager />);
    expect(await screen.findByText("Times are shown in UTC.")).toBeDefined();
  });

  it("uses a hydration-safe time-zone placeholder during server rendering", () => {
    expect(renderToString(<AvailabilitySlotManager />)).toContain("your browser&#x27;s time zone");
  });

  it("ignores a pending list response after the manager unmounts", async () => {
    mocks.apiCall.mockImplementation(() => new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, status: 200, data: [] }), 0);
    }));
    const view = render(<AvailabilitySlotManager />);
    expect(mocks.apiCall).toHaveBeenCalledOnce();
    view.unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
