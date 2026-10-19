import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./admin-mentors", () => ({ AdminMentors: () => <div data-testid="admin-mentors" /> }));

import AdminMentorsPage, { metadata } from "./page";

describe("admin mentors page", () => {
  it("has a title for the admin area", () => {
    expect(metadata.title).toBe("Mentors | DevMentor admin");
  });

  it("renders the heading, a link to the public page and the client table", () => {
    render(<AdminMentorsPage />);
    expect(screen.getByRole("heading", { name: "Mentors" })).toBeDefined();
    expect(screen.getByRole("link", { name: "View public page" }).getAttribute("href")).toBe("/mentors");
    expect(screen.getByTestId("admin-mentors")).toBeDefined();
  });
});
