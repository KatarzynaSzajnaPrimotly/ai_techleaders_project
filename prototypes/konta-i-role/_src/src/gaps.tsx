// Components the design system does not have yet. Each is the simplest version built from tokens
// and is marked LUKA DS with the gap number from lekcja-07/mapa-ekranow.md section 5.
import { useId, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, cn } from "@devmentor/ui";
import { currentAccount, currentRole, signOut, useStore, visit, type State } from "./store";
import type { Role } from "./data";

/* LUKA DS D-04: Label */
export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-foreground", className)} {...props} />;
}

/* LUKA DS D-04: Input */
export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm text-foreground",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "aria-[invalid=true]:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

type AlertTone = "info" | "error" | "success";

/* LUKA DS D-04: Alert (inline message: error, info, success) */
export function Alert({ tone = "info", className, children, ...props }: ComponentProps<"div"> & { tone?: AlertTone }) {
  const tones: Record<AlertTone, string> = {
    info: "border-border bg-secondary text-foreground",
    error: "border-destructive text-destructive",
    success: "border-primary text-foreground",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-md border px-3 py-2 text-sm", tones[tone], className)} {...props}>
      {children}
    </div>
  );
}

/* LUKA DS D-06: GitHub mark (the ui package has no icon library) */
export function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/* LUKA DS D-05: centred card for the public auth pages (sign in, register, check your e-mail, confirm) */
export function AuthCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold leading-none tracking-tight">{title}</h1>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  );
}

export interface PublicField {
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  hint?: ReactNode;
}

export interface PublicFormProps<S extends z.ZodType> {
  schema: S;
  fields: PublicField[];
  submitLabel: string;
  busyLabel?: string;
  busy?: boolean;
  /** Disabled without the loading label, for example while a rate limit applies. */
  locked?: boolean;
  initial?: Record<string, string>;
  formError?: ReactNode;
  onSubmit: (values: z.output<S>) => void;
}

/* LUKA DS D-02: PublicForm. The public-skin counterpart of CrudForm: labelled fields, errors in
   role="alert", focus moves to the first invalid field, the submit button locks while saving. */
export function PublicForm<S extends z.ZodType>({ schema, fields, submitLabel, busyLabel = "Saving…", busy = false, locked = false, initial = {}, formError, onSubmit }: PublicFormProps<S>) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, initial[field.name] ?? ""])),
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  // Every screen is in the DOM at once, so ids must be unique per form instance.
  const formId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<string, string[]>;
      setErrors(fieldErrors);
      const first = fields.find((field) => fieldErrors[field.name]);
      if (first) event.currentTarget.querySelector<HTMLInputElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {fields.map((field) => {
        const fieldErrors = errors[field.name];
        const id = `${formId}-${field.name}`;
        return (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={id}>{field.label}</Label>
            <Input
              id={id}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete ?? "off"}
              value={values[field.name]}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              aria-invalid={fieldErrors ? true : undefined}
              aria-describedby={fieldErrors ? `${id}-error` : undefined}
            />
            {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
            {fieldErrors ? (
              <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
                {fieldErrors.join(" ")}
              </p>
            ) : null}
          </div>
        );
      })}
      {formError ? <div className="space-y-2">{formError}</div> : null}
      <Button type="submit" className="w-full" disabled={busy || locked}>
        {busy ? busyLabel : submitLabel}
      </Button>
    </form>
  );
}

const ROLE_LABEL: Record<Role, string> = { mentee: "Mentee", mentor: "Mentor", operator: "Operator" };

/* LUKA DS D-03: RoleShell (header with the user, role badge and sign-out; no navigation until a second screen exists) */
export function RoleShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const account = useStore((current: State) => currentAccount(current));
  const role = useStore((current: State) => currentRole(current));
  return (
    <div className="min-h-[28rem]">
      <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-3">
        <span className="font-semibold tracking-tight">DevMentor</span>
        <div className="flex items-center gap-3 text-sm">
          {account ? (
            <>
              <span>{account.name}</span>
              {role ? <Badge variant="secondary">{ROLE_LABEL[role]}</Badge> : null}
            </>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              signOut();
              visit("s01");
            }}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main className={cn("mx-auto space-y-6 px-6 py-8", wide ? "max-w-4xl" : "max-w-2xl")}>{children}</main>
    </div>
  );
}
