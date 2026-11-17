import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MentorsPage, { dynamic, metadata } from "./page";

describe("public mentors page", () => {
  it("does not list private or unpublished mentor data before the directory is in scope", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Mentors | DevMentor");
    render(<MentorsPage />);
    expect(screen.getByRole("heading", { name: "Meet our mentors" })).toBeDefined();
    expect(screen.getByText("Mentors share their pages directly. Browseable mentor pages will be available soon.")).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.queryByText(/@example\.com/)).toBeNull();
  });
});
