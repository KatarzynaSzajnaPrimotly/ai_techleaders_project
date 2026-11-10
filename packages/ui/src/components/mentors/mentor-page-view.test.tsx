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
});
