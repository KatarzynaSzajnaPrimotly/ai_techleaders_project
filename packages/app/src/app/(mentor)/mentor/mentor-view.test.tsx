import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentorHomeView } from "./mentor-view";

describe("MentorHomeView", () => {
  it("renders a neutral mentor welcome in the role shell", () => {
    render(<MentorHomeView name="mentor-login" session={{ userId: "user-2", role: "mentor", sessionVersion: 0 }} initialPublishDueAt={new Date("2026-11-23T12:00:00Z")} />);
    expect(screen.getByRole("heading", { name: "Welcome" })).toBeTruthy();
    expect(screen.getByText("You are signed in as a mentor.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Edit your mentor page" }).getAttribute("href")).toBe("/mentor/profile");
    expect(screen.getByRole("link", { name: "Manage availability" }).getAttribute("href")).toBe("/mentor/slots");
    expect(screen.getByRole("link", { name: "Set session prices" }).getAttribute("href")).toBe("/mentor/prices");
    expect(screen.getByText("mentor-login")).toBeTruthy();
    expect(screen.getByText(/Publish at least one bookable session by/)).toBeTruthy();
    expect(screen.queryByText(/become a mentor/i)).toBeNull();
  });

  it("does not show a first-publish ask before an accepted invitation supplies a deadline", () => {
    render(<MentorHomeView name="mentor-login" session={{ userId: "user-2", role: "mentor", sessionVersion: 0 }} initialPublishDueAt={null} />);
    expect(screen.queryByText(/Publish at least one bookable session by/)).toBeNull();
  });
});
