import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("links the brand to the home page and renders the navigation", () => {
    render(<SiteHeader brand="Mentora" homeHref="/home" links={[{ label: "Find a tutor", href: "/mentors" }]} />);
    expect(screen.getByRole("link", { name: "Mentora" }).getAttribute("href")).toBe("/home");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav.querySelector("a")?.getAttribute("href")).toBe("/mentors");
    expect(screen.getByText("Find a tutor")).toBeDefined();
  });

  it("renders an empty navigation without links", () => {
    render(<SiteHeader brand="Mentora" homeHref="/home" links={[]} />);
    expect(screen.getByRole("navigation", { name: "Main" }).children).toHaveLength(0);
  });
});
