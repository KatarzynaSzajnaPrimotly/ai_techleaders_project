import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentorHomeView } from "./mentor-view";

describe("MentorHomeView", () => {
  it("renders a neutral mentor welcome in the role shell", () => {
    render(<MentorHomeView name="mentor-login" session={{ userId: "user-2", role: "mentor", sessionVersion: 0 }} />);
    expect(screen.getByRole("heading", { name: "Welcome" })).toBeTruthy();
    expect(screen.getByText("You are signed in as a mentor.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    expect(screen.getByText("mentor-login")).toBeTruthy();
    expect(screen.queryByText(/become a mentor/i)).toBeNull();
  });
});
