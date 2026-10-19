import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ list: vi.fn() }));

vi.mock("../../server/container", () => ({
  createRequestScope: async () => ({ cradle: { mentorService: { list: mocks.list } } }),
}));

import MentorsPage, { dynamic, metadata } from "./page";

beforeEach(() => {
  mocks.list.mockReset();
});

describe("public mentors page", () => {
  it("is rendered on demand with a title", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Mentors | DevMentor");
  });

  it("shows an empty state when there are no mentors", async () => {
    mocks.list.mockResolvedValue([]);
    render(await MentorsPage());
    expect(screen.getByRole("heading", { name: "Meet our mentors" })).toBeDefined();
    expect(screen.getByText("No mentors have joined yet.")).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("lists mentors with their join date", async () => {
    mocks.list.mockResolvedValue([
      { id: "1", name: "Ada Lovelace", email: "ada@example.com", createdAt: new Date("2026-10-19T09:00:00Z") },
      { id: "2", name: "Grace Hopper", email: "grace@example.com", createdAt: new Date("2026-10-20T09:00:00Z") },
    ]);
    render(await MentorsPage());
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Ada Lovelace")).toBeDefined();
    expect(screen.getByText("Joined 2026-10-19")).toBeDefined();
    expect(screen.getByText("Joined 2026-10-20")).toBeDefined();
    expect(screen.queryByText("No mentors have joined yet.")).toBeNull();
  });
});
