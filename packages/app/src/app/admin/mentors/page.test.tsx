import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ list: vi.fn() }));

vi.mock("../../../server/container", () => ({
  createRequestScope: async () => ({ cradle: { mentorService: { list: mocks.list } } }),
}));

import AdminMentorsPage, { dynamic, metadata } from "./page";

beforeEach(() => {
  mocks.list.mockReset();
});

describe("admin mentors page", () => {
  it("is rendered on demand with a title", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Mentors | DevMentor admin");
  });

  it("shows an empty table row and a zero count without mentors", async () => {
    mocks.list.mockResolvedValue([]);
    render(await AdminMentorsPage());
    expect(screen.getByRole("heading", { name: "Mentors" })).toBeDefined();
    expect(screen.getByText("No mentors yet.")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined();
    expect(screen.getByRole("link", { name: "View public page" }).getAttribute("href")).toBe("/mentors");
  });

  it("renders a row per mentor and the total", async () => {
    mocks.list.mockResolvedValue([
      { id: "1", name: "Ada Lovelace", email: "ada@example.com", createdAt: new Date("2026-10-19T09:00:00Z") },
      { id: "2", name: "Grace Hopper", email: "grace@example.com", createdAt: new Date("2026-10-20T09:00:00Z") },
    ]);
    render(await AdminMentorsPage());
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByRole("cell", { name: "Ada Lovelace" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "grace@example.com" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "2026-10-20" })).toBeDefined();
    expect(screen.queryByText("No mentors yet.")).toBeNull();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });
});
