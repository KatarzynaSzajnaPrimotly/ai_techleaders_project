import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentorCard } from "./mentor-card";

describe("MentorCard", () => {
  it("shows the mentor details and an uppercase initial", () => {
    render(
      <ul>
        <MentorCard name="ada lovelace" email="ada@example.com" joinedAt="2026-10-19" />
      </ul>,
    );
    expect(screen.getByText("ada lovelace")).toBeDefined();
    expect(screen.getByText("ada@example.com")).toBeDefined();
    expect(screen.getByText("Joined 2026-10-19")).toBeDefined();
    expect(screen.getByText("A")).toBeDefined();
    expect(screen.getByRole("listitem")).toBeDefined();
  });
});
