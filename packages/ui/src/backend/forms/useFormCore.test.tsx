import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import type { ApiResult } from "../api/types";
import { useFormCore } from "./useFormCore";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().pipe(z.email("Email is invalid")),
});
const fields = [{ name: "name" }, { name: "email" }];
const success: ApiResult<unknown> = { ok: true, status: 201, data: { id: "1" } };

function setup(onSubmit = vi.fn().mockResolvedValue(success), options: { onSuccess?: (data: unknown) => void; onCancel?: () => void } = {}) {
  function FormHarness() {
    const form = useFormCore({ schema, fields, onSubmit, ...options });
    return (
      <form onSubmit={form.handleSubmit} onKeyDown={form.handleKeyDown}>
        <label>
          Name
          <input
            value={form.values.name}
            onChange={(event) => form.setValue("name", event.target.value)}
          />
        </label>
        <label>
          Email
          <input
            value={form.values.email}
            onChange={(event) => form.setValue("email", event.target.value)}
          />
        </label>
        {form.fieldErrors.name?.map((error) => <p key={error}>{error}</p>)}
        {form.fieldErrors.email?.map((error) => <p key={error}>{error}</p>)}
        {form.formError ? <p role="alert">{form.formError}</p> : null}
        <button type="submit" disabled={form.submitting}>{form.submitting ? "Saving…" : "Save"}</button>
      </form>
    );
  }

  const view = render(<FormHarness />);
  const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  return { onSubmit, type, ...view };
}

describe("useFormCore", () => {
  it("initializes values from fields and updates them by name", () => {
    setup();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("");
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Ada");
  });

  it("shows schema errors and skips submit for invalid values", () => {
    const { onSubmit, type } = setup();
    type("Email", "invalid");
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);
    expect(screen.getByText("Name is required")).toBeDefined();
    expect(screen.getByText("Email is invalid")).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits parsed values, reports success, resets values, and clears errors", async () => {
    const onSuccess = vi.fn();
    const { onSubmit, type } = setup(undefined, { onSuccess });
    type("Name", "  Ada ");
    type("Email", " ADA@Example.com ");
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ id: "1" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
    expect(screen.queryByText("Name is required")).toBeNull();
  });

  it("resets a successful submission without an onSuccess callback", async () => {
    const { type } = setup();
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);
    await waitFor(() => expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe(""));
  });

  it("keeps values and exposes server field and form errors", async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      error: { code: "VALIDATION_ERROR", message: "Validation failed", fieldErrors: { email: ["Already taken"] } },
    });
    const { type } = setup(onSubmit);
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);
    expect(await screen.findByText("Already taken")).toBeDefined();
    expect(screen.getByText("Validation failed")).toBeDefined();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Ada");
  });

  it("uses an empty field-error map when a server error has no field errors", async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      error: { code: "CONFLICT", message: "Mentor already exists" },
    });
    const { type } = setup(onSubmit);
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);
    expect((await screen.findByRole("alert")).textContent).toBe("Mentor already exists");
  });

  it("resets a previous form error when a new submission starts", async () => {
    const onSubmit = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 409, error: { code: "CONFLICT", message: "Exists" } })
      .mockResolvedValueOnce(success);
    const { type } = setup(onSubmit);
    type("Name", "Ada");
    type("Email", "ada@example.com");
    const form = screen.getByRole("button", { name: "Save" }).closest("form")!;
    fireEvent.submit(form);
    await screen.findByText("Exists");
    fireEvent.submit(form);
    await waitFor(() => expect(screen.queryByText("Exists")).toBeNull());
  });

  it("shows submitting state until the request settles", async () => {
    let finish: (value: ApiResult<unknown>) => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<ApiResult<unknown>>((resolve) => { finish = resolve; }));
    const { type } = setup(onSubmit);
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);
    expect((await screen.findByRole("button", { name: "Saving…" }) as HTMLButtonElement).disabled).toBe(true);
    finish(success);
    await screen.findByRole("button", { name: "Save" });
  });

  it("submits on Ctrl+Enter and Meta+Enter but not plain Enter or other keys", async () => {
    const { onSubmit, type } = setup();
    type("Name", "Ada");
    type("Email", "ada@example.com");
    const form = screen.getByRole("button", { name: "Save" }).closest("form")!;
    fireEvent.keyDown(form, { key: "Enter", ctrlKey: true });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    type("Name", "Grace");
    type("Email", "grace@example.com");
    fireEvent.keyDown(form, { key: "Enter", metaKey: true });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    fireEvent.keyDown(form, { key: "Enter" });
    fireEvent.keyDown(form, { key: "x", ctrlKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("calls onCancel on Escape when provided and safely ignores it otherwise", () => {
    const onCancel = vi.fn();
    const first = setup(undefined, { onCancel });
    fireEvent.keyDown(screen.getByLabelText("Name").closest("form")!, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
    first.unmount();
    setup();
    expect(() => fireEvent.keyDown(screen.getByLabelText("Name").closest("form")!, { key: "Escape" })).not.toThrow();
  });
});
