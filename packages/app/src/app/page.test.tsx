import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FEATURED_TUTORS, SUBJECTS } from "@devmentor/core";

import Home, { metadata } from "./page";

describe("home page", () => {
  it("has the DevMentor title", () => {
    expect(metadata.title).toBe("DevMentor — Learn anything, from real people");
    expect(metadata.description).toContain("online lessons");
  });

  it("shows the hero with a search that targets the tutors page", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Find the perfect tutor and start learning today" })).toBeDefined();
    const form = screen.getByRole("search");
    expect(form.getAttribute("action")).toBe("/mentors");
    expect(within(form).getByLabelText("What do you want to learn?").getAttribute("name")).toBe("subject");
  });

  it("links every subject chip to the tutors page filtered by it", () => {
    render(<Home />);
    const chips = within(screen.getByRole("list", { name: "Subjects" })).getAllByRole("link");
    expect(chips.map((chip) => chip.textContent)).toEqual([...SUBJECTS]);
    expect(within(screen.getByRole("list", { name: "Subjects" })).getByRole("link", { name: "Exam Prep" }).getAttribute("href")).toBe(
      "/mentors?subject=Exam%20Prep",
    );
  });

  it("shows the platform stats", () => {
    render(<Home />);
    for (const text of ["900+", "Verified tutors", "4.8/5", "Average rating", "40k+", "Lessons delivered"]) {
      expect(screen.getByText(text)).toBeDefined();
    }
  });

  it("features the sample tutors", () => {
    render(<Home />);
    const section = screen.getByRole("region", { name: "Featured tutors" });
    expect(within(section).getAllByRole("listitem")).toHaveLength(FEATURED_TUTORS.length);
    expect(within(section).getByRole("heading", { name: "Ana Ruiz" })).toBeDefined();
    expect(within(section).getByRole("link", { name: "See all →" }).getAttribute("href")).toBe("/mentors");
  });

  it("explains how it works in three numbered steps", () => {
    render(<Home />);
    const steps = within(screen.getByRole("region", { name: "How it works" })).getAllByRole("listitem");
    expect(steps.map((step) => step.querySelector("h3")?.textContent)).toEqual([
      "Find a tutor",
      "Book a trial lesson",
      "Learn at your pace",
    ]);
    expect(steps.map((step) => step.querySelector("div")?.textContent)).toEqual(["1", "2", "3"]);
  });

  it("has a header and a footer", () => {
    render(<Home />);
    expect(screen.getByRole("banner")).toBeDefined();
    expect(screen.getByRole("contentinfo").textContent).toContain("DevMentor");
  });
});
