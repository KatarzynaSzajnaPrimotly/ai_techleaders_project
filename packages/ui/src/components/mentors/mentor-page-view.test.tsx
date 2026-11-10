import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentorPageView } from "./mentor-page-view";

describe("MentorPageView", () => {
  it("shows only the public profile details and omits reputation and private data", () => {
    const { container } = render(<MentorPageView profile={{
      slug: "ada-lovelace", displayName: "Ada Lovelace", publicWorkUrl: "https://example.test/work",
      bio: "I build reliable systems.", stackTags: ["TypeScript", "AI agents"],
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
    }} />);
    expect(screen.getByText("No upcoming times have been published.")).toBeDefined();
  });
});
