import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalTime } from "./LocalTime";

const NativeDateTimeFormat = Intl.DateTimeFormat;
afterEach(() => vi.restoreAllMocks());

describe("LocalTime", () => {
  it("renders UTC first and then updates to the viewer time zone", async () => {
    const resolved = new NativeDateTimeFormat().resolvedOptions();
    vi.spyOn(NativeDateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ ...resolved, timeZone: "America/Los_Angeles" });

    const serverMarkup = renderToString(<LocalTime value="2026-11-23T12:00:00.000Z" />);
    expect(serverMarkup).toContain("November 23, 2026 at 12:00 PM");
    render(<LocalTime value="2026-11-23T12:00:00.000Z" />);
    const time = await screen.findByText("November 23, 2026 at 4:00 AM");
    expect(time.tagName).toBe("TIME");
    expect(time.getAttribute("datetime")).toBe("2026-11-23T12:00:00.000Z");
  });

  it("falls back to UTC when the browser does not report a time zone", async () => {
    vi.spyOn(NativeDateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ ...new NativeDateTimeFormat().resolvedOptions(), timeZone: "" });
    render(<LocalTime value="2026-11-23T12:00:00.000Z" />);
    expect(await screen.findByText("November 23, 2026 at 12:00 PM")).toBeTruthy();
  });
});
