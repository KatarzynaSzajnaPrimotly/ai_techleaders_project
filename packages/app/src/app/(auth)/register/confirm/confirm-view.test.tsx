import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmView } from "./confirm-view";

afterEach(() => vi.unstubAllGlobals());

describe("ConfirmView", () => {
  it("shows invalid and used token states", () => {
    render(<ConfirmView state="invalid" />);
    expect(screen.getByRole("alert").textContent).toContain("invalid or expired");
    render(<ConfirmView state="used" email="ada@example.test" />);
    expect(screen.getByRole("status").textContent).toContain("already been used");
  });

  it("submits password with closure token, preserving it out of the form fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "UNAVAILABLE", message: "private" } }), { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ConfirmView state="ready" token="signed-token" email="ada@example.test" />);
    expect(screen.queryByLabelText("token")).toBeNull();
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "a secure password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("couldn't create your account"));
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ body: JSON.stringify({ password: "a secure password", token: "signed-token" }) });
  });

  it("moves to the used state when confirmation reports a consumed token", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "UNAUTHORIZED", message: "This link has already been used. Please sign in." } }), { status: 401 })));
    render(<ConfirmView state="ready" token="signed-token" email="ada@example.test" />);
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "a secure password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("already been used"));
  });

  it("moves to the invalid state when confirmation token expires", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "UNAUTHORIZED", message: "expired" } }), { status: 401 })));
    render(<ConfirmView state="ready" token="expired-token" email="ada@example.test" />);
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "a secure password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("invalid or expired"));
  });

  it("navigates after successful account creation", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, data: { redirectTo: "/home" } }), { status: 200 })));
    render(<ConfirmView state="ready" token="signed-token" email="ada@example.test" />);
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "a secure password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => expect(vi.mocked(fetch)).toHaveBeenCalled());
  });
});
