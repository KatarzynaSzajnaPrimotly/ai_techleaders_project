import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentorPageView } from "./mentor-page-view";

describe("MentorPageView", () => {
  it("shows only the public profile details and omits reputation and private data", () => {
    const { container } = render(<MentorPageView profile={{
      slug: "ada-lovelace", displayName: "Ada Lovelace", publicWorkUrl: "https://example.test/work",
      bio: "I build reliable systems.", stackTags: ["TypeScript", "AI agents"], prices: null, isBookable: false,
    }} />);
    expect(screen.getByRole("heading", { name: "Ada Lovelace" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Public work" }).getAttribute("href")).toBe("https://example.test/work");
    expect(screen.getByText("I build reliable systems.")).toBeDefined();
    expect(screen.getByText("TypeScript")).toBeDefined();
    expect(container.textContent).not.toMatch(/rating|reviews|score|ranking|email|stripe|payout/i);
  });

  it("shows future slots and explains the two-hour availability boundary", () => {
    render(<MentorPageView profile={{
      slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test/work", bio: "Engineer", stackTags: [],
      prices: { price25Cents: 12500, price50Cents: 25000, currency: "EUR" }, isBookable: true,
    }} slots={[
      { id: "available", startsAt: "2026-11-23T18:00:00.000Z", meetsLeadTime: true },
      { id: "too-soon", startsAt: "2026-11-23T17:00:00.000Z", meetsLeadTime: false },
    ]} />);
    expect(screen.getByText("Available")).toBeDefined();
    expect(screen.getByLabelText("Unavailable: less than two hours' notice")).toBeDefined();
  });

  it("shows the empty upcoming availability state", () => {
    render(<MentorPageView profile={{
      slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test/work", bio: "Engineer", stackTags: [],
      prices: null, isBookable: false,
    }} />);
    expect(screen.getByText("No upcoming times have been published.")).toBeDefined();
    expect(screen.getByText("Not bookable yet.")).toBeDefined();
    expect(screen.getByText("Prices have not been set yet.")).toBeDefined();
  });

  it("shows both prices in the configured platform currency", () => {
    render(<MentorPageView profile={{ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [], prices: { price25Cents: 12550, price50Cents: 26000, currency: "EUR" }, isBookable: true }} />);
    expect(screen.getByText("25 minutes: 125.50 EUR")).toBeDefined();
    expect(screen.getByText("50 minutes: 260.00 EUR")).toBeDefined();
  });

  it("marks a published time as not bookable until prices and a session channel are ready", () => {
    render(<MentorPageView profile={{
      slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [],
      prices: null, isBookable: false,
    }} slots={[{ id: "slot-1", startsAt: "2026-11-23T18:00:00.000Z", meetsLeadTime: true }]} />);
    expect(screen.getByText("Not bookable yet.", { selector: "p" })).toBeDefined();
    expect(screen.getByText("Not bookable yet", { selector: "span" })).toBeDefined();
  });
});
