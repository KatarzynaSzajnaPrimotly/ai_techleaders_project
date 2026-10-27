import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenteeHomeView } from "./home-view";

describe("MenteeHomeView", () => {
  it("renders a neutral mentee welcome in the role shell", () => {
    render(<MenteeHomeView session={{ userId: "user-1", role: "mentee" }} />);
    expect(screen.getByRole("heading", { name: "Welcome" })).toBeTruthy();
    expect(screen.getByText("You are signed in as a mentee.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    expect(screen.queryByText(/become a mentor/i)).toBeNull();
  });
});
