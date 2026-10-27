import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { focusPublicField, PublicForm, PUBLIC_FORM_FIELD_RENDERERS, type PublicField } from "./PublicForm";

const schema = z.object({
  email: z.email("Enter a valid e-mail address."),
  name: z.string().min(1, "Enter a name."),
  password: z.string().min(1, "Enter a password."),
});

const fields: PublicField[] = [
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", hint: "Use your account address." },
  { name: "name", label: "Name" },
  { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
];

describe("PUBLIC_FORM_FIELD_RENDERERS", () => {
  it("covers all supported public field types", () => {
    expect(Object.keys(PUBLIC_FORM_FIELD_RENDERERS).sort()).toEqual(["email", "password", "text"]);
  });
});

describe("focusPublicField", () => {
  it("focuses the matching input and safely ignores an absent one", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    form.append(input);
    document.body.append(form);
    focusPublicField(form, "missing");
    focusPublicField(form, "email");
    expect(document.activeElement).toBe(input);
    form.remove();
  });
});

describe("PublicForm", () => {
  it("renders labelled fields with hints and explicit field types", () => {
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" onSubmit={vi.fn()} />);
    expect(screen.getByLabelText("E-mail").getAttribute("type")).toBe("email");
    expect(screen.getByLabelText("Name").getAttribute("type")).toBe("text");
    expect(screen.getByLabelText("Password").getAttribute("type")).toBe("password");
    expect(screen.getByText("Use your account address.").id).toContain("-hint");
    expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
  });

  it("shows client validation errors and focuses the first invalid field", async () => {
    const onSubmit = vi.fn();
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    expect(await screen.findByText("Enter a valid e-mail address.")).toBeTruthy();
    expect(screen.getByText("Enter a name.")).toBeTruthy();
    await waitFor(() => expect(screen.getByLabelText("E-mail")).toBe(document.activeElement));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not try to focus a field that is absent from the rendered form", async () => {
    render(<PublicForm schema={z.object({ email: z.email() })} fields={[]} submitLabel="Continue" onSubmit={vi.fn()} />);
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    await waitFor(() => expect(document.activeElement).not.toBe(screen.getByRole("button", { name: "Continue" })));
  });

  it("shows a pending label and disables submission until success", async () => {
    let resolveSubmit: ((result: { ok: true; status: number; data: unknown }) => void) | undefined;
    const onSubmit = vi.fn(() => new Promise<{ ok: true; status: number; data: unknown }>((resolve) => {
      resolveSubmit = resolve;
    }));
    const onSuccess = vi.fn();
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" busyLabel="Sending…" onSubmit={onSubmit} onSuccess={onSuccess} />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    expect(screen.getByRole("button", { name: "Sending…" }).hasAttribute("disabled")).toBe(true);
    resolveSubmit?.({ ok: true, status: 200, data: { redirectTo: "/home" } });
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ redirectTo: "/home" }));
  });

  it("keeps values and renders server field and form errors", async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      error: { code: "VALIDATION_ERROR", message: "Check the form", fieldErrors: { email: ["E-mail is already used."] } },
    });
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    expect(await screen.findByText("E-mail is already used.")).toBeTruthy();
    expect(screen.getByText("Check the form")).toBeTruthy();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Ada");
    expect(screen.getByLabelText("E-mail").getAttribute("aria-invalid")).toBe("true");
  });

  it.each([
    [45, "Too many attempts. Try again in 1 minute."],
    [120, "Too many attempts. Try again in 2 minutes."],
  ])("shows Retry-After %s seconds as a user-facing retry message", async (retryAfterSeconds, message) => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      retryAfterSeconds,
      error: { code: "RATE_LIMITED", message: "Too many requests" },
    });
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    expect(await screen.findByText(message)).toBeTruthy();
  });

  it("uses a generic retry message when Retry-After is unavailable", async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      error: { code: "RATE_LIMITED", message: "Raw rate limit detail" },
    });
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    expect(await screen.findByText("Too many attempts. Please try again later.")).toBeTruthy();
    expect(screen.queryByText("Raw rate limit detail")).toBeNull();
  });

  it("maps endpoint errors and renders a persistent note", async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      error: { code: "UNAUTHORIZED", message: "Raw private error" },
    });
    render(
      <PublicForm
        schema={schema}
        fields={fields}
        submitLabel="Continue"
        onSubmit={onSubmit}
        onErrorMessage={() => "Invalid credentials, or sign in with GitHub instead."}
        formNote={<p>Password reset isn&apos;t available yet.</p>}
      />,
    );
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);
    expect(await screen.findByText("Invalid credentials, or sign in with GitHub instead.")).toBeTruthy();
    expect(screen.queryByText("Raw private error")).toBeNull();
    expect(screen.getByText("Password reset isn't available yet.")).toBeTruthy();
  });

  it("forwards Escape to cancel and Ctrl+Enter submits", () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue({ ok: true, status: 200, data: null });
    render(<PublicForm schema={schema} fields={fields} submitLabel="Continue" onSubmit={onSubmit} onCancel={onCancel} />);
    const form = screen.getByRole("button", { name: "Continue" }).closest("form")!;
    const requestSubmit = vi.spyOn(form, "requestSubmit").mockImplementation(() => fireEvent.submit(form));
    fireEvent.keyDown(form, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
    fireEvent.keyDown(form, { key: "Enter", ctrlKey: true });
    expect(requestSubmit).toHaveBeenCalledOnce();
  });

});
