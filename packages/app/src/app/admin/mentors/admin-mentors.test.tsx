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
  { slug: "ada-lovelace", displayName: "Ada Lovelace", publicWorkUrl: "https://example.test/ada", bio: "Mathematician", stackTags: ["TypeScript"] },
  { slug: "grace-hopper", displayName: "Grace Hopper", publicWorkUrl: "https://example.test/grace", bio: "Engineer", stackTags: ["Python"] },
];
const listOk = (data = rows): ApiResult<unknown> => ({ ok: true, status: 200, data });
const listFailed: ApiResult<unknown> = { ok: false, status: 500, error: { code: "INTERNAL_ERROR", message: "Internal server error" } };

beforeEach(() => {
  mocks.apiCall.mockReset();
});

describe("AdminMentors", () => {
  it("shows a loading state, then published profiles without private contact fields", async () => {
    mocks.apiCall.mockResolvedValue(listOk());
    render(<AdminMentors />);
    expect(screen.getByRole("status")).toBeDefined();
    expect(await screen.findByRole("cell", { name: "Ada Lovelace" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "https://example.test/grace" })).toBeDefined();
    expect(screen.queryByText(/@example\.com/)).toBeNull();
    expect(screen.getByText("2")).toBeDefined();
    expect(mocks.apiCall).toHaveBeenCalledWith("/api/mentors/published");
  });

  it("shows the empty state with a zero count", async () => {
    mocks.apiCall.mockResolvedValue(listOk([]));
    render(<AdminMentors />);
    expect(await screen.findByText("No mentor has published a page yet.")).toBeDefined();
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

  it("keeps mentor creation out of the operator screen", async () => {
    mocks.apiCall.mockResolvedValue(listOk([]));
    render(<AdminMentors />);
    await screen.findByText("No mentor has published a page yet.");
    expect(screen.queryByLabelText("Name")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add mentor" })).toBeNull();
    expect(mocks.apiCall).toHaveBeenCalledTimes(1);
    expect(mocks.apiCall).toHaveBeenCalledWith("/api/mentors/published");
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
