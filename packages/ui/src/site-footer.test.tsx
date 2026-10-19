import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("shows the note and the links", () => {
    render(<SiteFooter note="© 2026 DevMentor" links={[{ label: "Mentors", href: "/mentors" }]} />);
    expect(screen.getByText("© 2026 DevMentor")).toBeDefined();
    expect(screen.getByRole("link", { name: "Mentors" }).getAttribute("href")).toBe("/mentors");
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeDefined();
  });
});
