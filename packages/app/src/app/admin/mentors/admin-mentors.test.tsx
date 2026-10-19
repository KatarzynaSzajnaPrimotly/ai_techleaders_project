import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiResult } from "@devmentor/ui";

const mocks = vi.hoisted(() => ({ apiCall: vi.fn() }));

vi.mock("@devmentor/ui", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@devmentor/ui")>()),
  apiCall: mocks.apiCall,
}));

import { AdminMentors } from "./admin-mentors";

const rows = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com", createdAt: "2026-10-19T09:00:00.000Z" },
  { id: "2", name: "Grace Hopper", email: "grace@example.com", createdAt: "2026-10-20T09:00:00.000Z" },
];
const listOk = (data = rows): ApiResult<unknown> => ({ ok: true, status: 200, data });
const listFailed: ApiResult<unknown> = { ok: false, status: 500, error: { code: "INTERNAL_ERROR", message: "Internal server error" } };

beforeEach(() => {
  mocks.apiCall.mockReset();
});

describe("AdminMentors", () => {
  it("shows a loading state, then the mentors with their count and join date", async () => {
    mocks.apiCall.mockResolvedValue(listOk());
    render(<AdminMentors />);
    expect(screen.getByRole("status")).toBeDefined();
    expect(await screen.findByRole("cell", { name: "Ada Lovelace" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "grace@example.com" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "2026-10-20" })).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(mocks.apiCall).toHaveBeenCalledWith("/api/mentors");
  });

  it("shows the empty state with a zero count", async () => {
    mocks.apiCall.mockResolvedValue(listOk([]));
    render(<AdminMentors />);
    expect(await screen.findByText("No mentors yet.")).toBeDefined();
    expect(screen.getByText("Add the first one below.")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined();
  });

  it("shows the error state and retries the request", async () => {
    mocks.apiCall.mockResolvedValueOnce(listFailed).mockResolvedValueOnce(listOk());
    render(<AdminMentors />);
    expect(await screen.findByText("Internal server error")).toBeDefined();
    expect(screen.getByText("–")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByRole("cell", { name: "Ada Lovelace" })).toBeDefined();
    expect(mocks.apiCall).toHaveBeenCalledTimes(2);
  });

  it("creates a mentor through the shared schema and reloads the list", async () => {
    const created = { id: "3", name: "Linus T", email: "linus@example.com", createdAt: "2026-10-21T09:00:00.000Z" };
    mocks.apiCall
      .mockResolvedValueOnce(listOk([]))
      .mockResolvedValueOnce({ ok: true, status: 201, data: created })
      .mockResolvedValueOnce(listOk([created]));
    render(<AdminMentors />);
    await screen.findByText("No mentors yet.");

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "  Linus T " } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "LINUS@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Add mentor" }));

    expect(await screen.findByRole("cell", { name: "Linus T" })).toBeDefined();
    expect(mocks.apiCall).toHaveBeenNthCalledWith(2, "/api/mentors", {
      method: "POST",
      body: { name: "Linus T", email: "linus@example.com" },
    });
  });

  it("validates before sending and shows server errors from the API", async () => {
    mocks.apiCall.mockResolvedValueOnce(listOk([])).mockResolvedValueOnce({
      ok: false,
      status: 409,
      error: { code: "CONFLICT", message: "A mentor with email ada@example.com already exists" },
    });
    render(<AdminMentors />);
    await screen.findByText("No mentors yet.");

    fireEvent.click(screen.getByRole("button", { name: "Add mentor" }));
    expect(screen.getByText("Name is required")).toBeDefined();
    expect(mocks.apiCall).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Add mentor" }));
    expect(await screen.findByText("A mentor with email ada@example.com already exists")).toBeDefined();
  });

  it("ignores a response that arrives after the component unmounted", async () => {
    let finish: (value: ApiResult<unknown>) => void = () => undefined;
    mocks.apiCall.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { unmount } = render(<AdminMentors />);
    unmount();
    finish(listOk());
    await waitFor(() => expect(mocks.apiCall).toHaveBeenCalledTimes(1));
  });
});
