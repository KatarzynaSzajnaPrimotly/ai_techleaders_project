import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TutorCard } from "./tutor-card";

const tutor = {
  name: "Ana Ruiz",
  avatarEmoji: "🧑‍🏫",
  headline: "Certified Spanish teacher",
  pricePerHour: 18,
  rating: 4.9,
  reviewCount: 312,
};

describe("TutorCard", () => {
  it("shows the tutor's details, rating and hourly price", () => {
    render(
      <ul>
        <TutorCard {...tutor} badge="Super tutor" />
      </ul>,
    );
    expect(screen.getByRole("heading", { name: "Ana Ruiz" })).toBeDefined();
    expect(screen.getByText("Certified Spanish teacher")).toBeDefined();
    expect(screen.getByText("★ 4.9")).toBeDefined();
    expect(screen.getByText("(312)")).toBeDefined();
    expect(screen.getByText("Super tutor")).toBeDefined();
    expect(screen.getByRole("listitem").textContent).toContain("$18/hr");
  });

  it("omits the badge when the tutor has none", () => {
    render(
      <ul>
        <TutorCard {...tutor} />
      </ul>,
    );
    expect(screen.queryByText("Super tutor")).toBeNull();
  });
});
