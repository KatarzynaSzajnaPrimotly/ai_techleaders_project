import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import type { ApiResult } from "../api/types";
import { CrudForm, type CrudField } from "./CrudForm";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().pipe(z.email("Email is invalid")),
});
const fields: CrudField[] = [
  { name: "name", label: "Name", placeholder: "Ada Lovelace" },
  { name: "email", label: "Email", type: "email" },
];

const success: ApiResult<unknown> = { ok: true, status: 201, data: { id: "1" } };

function setup(props: Partial<Parameters<typeof CrudForm<typeof schema>>[0]> = {}) {
  const onSubmit = vi.fn().mockResolvedValue(success);
  const view = render(<CrudForm schema={schema} fields={fields} onSubmit={onSubmit} {...props} />);
  const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  return { onSubmit, type, ...view };
}

describe("CrudForm", () => {
  it("renders a labelled input per field, with the right types and placeholders", () => {
    setup();
    expect((screen.getByLabelText("Name") as HTMLInputElement).type).toBe("text");
    expect((screen.getByLabelText("Email") as HTMLInputElement).type).toBe("email");
    expect((screen.getByLabelText("Name") as HTMLInputElement).placeholder).toBe("Ada Lovelace");
    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("supports a password field", () => {
    render(
      <CrudForm
        schema={z.object({ secret: z.string() })}
        fields={[{ name: "secret", label: "Secret", type: "password" }]}
        onSubmit={vi.fn()}
      />,
    );
    expect((screen.getByLabelText("Secret") as HTMLInputElement).type).toBe("password");
  });

  it("validates on the client with the shared schema and does not submit", () => {
    const { onSubmit, type } = setup();
    type("Email", "nope");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Name is required")).toBeDefined();
    expect(screen.getByText("Email is invalid")).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
    const input = screen.getByLabelText("Name");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("name-error");
  });

  it("submits the parsed output and resets the form on success", async () => {
    const onSuccess = vi.fn();
    const { onSubmit, type } = setup({ onSuccess });
    type("Name", "  Ada ");
    type("Email", " ADA@Example.com ");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ id: "1" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBeNull();
  });

  it("succeeds without an onSuccess callback", async () => {
    const { onSubmit, type } = setup();
    type("Name", "Ada");
    type("Email", "a@b.co");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    await waitFor(() => expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe(""));
  });

  it("shows server field errors next to the right field and the form message", async () => {
    const { onSubmit, type } = setup();
    onSubmit.mockResolvedValue({
      ok: false,
      status: 400,
      error: { code: "VALIDATION_ERROR", message: "Validation failed", fieldErrors: { email: ["Already taken", "Try another"] } },
    });
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Already taken Try another")).toBeDefined();
    expect(screen.getByText("Validation failed")).toBeDefined();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Ada");
  });

  it("shows only the message when the server sends no field errors", async () => {
    const { onSubmit, type } = setup();
    onSubmit.mockResolvedValue({ ok: false, status: 409, error: { code: "CONFLICT", message: "Mentor already exists" } });
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Mentor already exists")).toBeDefined();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it("clears the previous server message when submitting again", async () => {
    const { onSubmit, type } = setup();
    onSubmit.mockResolvedValueOnce({ ok: false, status: 409, error: { code: "CONFLICT", message: "Exists" } });
    type("Name", "Ada");
    type("Email", "ada@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("Exists");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.queryByText("Exists")).toBeNull());
  });

  it("disables the button and says Saving… while the request runs", async () => {
    let finish: (value: ApiResult<unknown>) => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<ApiResult<unknown>>((resolve) => (finish = resolve)));
    render(<CrudForm schema={schema} fields={fields} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    const busy = await screen.findByRole("button", { name: "Saving…" });
    expect((busy as HTMLButtonElement).disabled).toBe(true);
    finish(success);
    await screen.findByRole("button", { name: "Save" });
  });

  it("uses custom button labels and shows a Cancel button only with onCancel", () => {
    const onCancel = vi.fn();
    setup({ submitLabel: "Add mentor", cancelLabel: "Dismiss", onCancel });
    expect(screen.getByRole("button", { name: "Add mentor" })).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("has no Cancel button by default", () => {
    setup();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("submits with Ctrl+Enter and Cmd+Enter", async () => {
    const { onSubmit, type } = setup();
    type("Name", "Ada");
    type("Email", "a@b.co");
    const form = screen.getByLabelText("Name").closest("form")!;
    fireEvent.keyDown(form, { key: "Enter", ctrlKey: true });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    type("Name", "Grace");
    type("Email", "g@b.co");
    fireEvent.keyDown(form, { key: "Enter", metaKey: true });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
  });

  it("does not submit on a plain Enter keydown or other keys", () => {
    const { onSubmit, type } = setup();
    type("Name", "Ada");
    type("Email", "a@b.co");
    const form = screen.getByLabelText("Name").closest("form")!;
    fireEvent.keyDown(form, { key: "Enter" });
    fireEvent.keyDown(form, { key: "a", ctrlKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cancels with Escape, and ignores Escape without onCancel", () => {
    const onCancel = vi.fn();
    const first = setup({ onCancel });
    fireEvent.keyDown(screen.getByLabelText("Name").closest("form")!, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
    first.unmount();
    setup();
    expect(() => fireEvent.keyDown(screen.getByLabelText("Name").closest("form")!, { key: "Escape" })).not.toThrow();
  });
});
