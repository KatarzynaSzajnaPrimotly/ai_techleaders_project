import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RegisterView } from "./register-view";

afterEach(() => vi.unstubAllGlobals());

describe("RegisterView", () => {
  it("submits account details with returnTo and shows generic success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, data: { message: "Check your e-mail for next steps." } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<RegisterView returnTo="/mentor" />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByRole("status");
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: "POST", body: JSON.stringify({ email: "ada@example.test", displayName: "Ada", returnTo: "/mentor" }) });
    expect(screen.getByRole("status").textContent).toContain("Check your e-mail for next steps.");
    fireEvent.click(screen.getByRole("button", { name: "Didn't get it? Register again." }));
    expect(screen.getByLabelText("Name")).toBeTruthy();
  });

  it("retains values and gives generic mail delivery failure copy", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "UNAVAILABLE", message: "private detail" } }), { status: 503 })));
    render(<RegisterView />);
    const name = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("couldn't send the e-mail"));
    expect(name.value).toBe("Ada");
    expect(screen.getByRole("alert").textContent).not.toContain("private detail");
  });

  it("maps other registration errors to generic copy", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "INVALID", message: "private" } }), { status: 400 })));
    render(<RegisterView />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("couldn't start registration"));
  });
});
