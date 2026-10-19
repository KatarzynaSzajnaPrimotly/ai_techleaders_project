"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import type { ApiResult } from "../api/types";

export interface CrudField {
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
}

export interface CrudFormProps<S extends z.ZodType> {
  schema: S;
  fields: CrudField[];
  onSubmit: (values: z.output<S>) => Promise<ApiResult<unknown>>;
  onSuccess?: (data: unknown) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

type FieldErrors = Record<string, string[]>;

export function CrudForm<S extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: CrudFormProps<S>) {
  const emptyValues = () => Object.fromEntries(fields.map((field) => [field.name, ""]));
  const [values, setValues] = useState<Record<string, string>>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors as FieldErrors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    const result = await onSubmit(parsed.data);
    setSubmitting(false);

    if (result.ok) {
      setValues(emptyValues());
      onSuccess?.(result.data);
      return;
    }
    setFieldErrors(result.error.fieldErrors ?? {});
    setFormError(result.error.message);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    } else if (event.key === "Escape") {
      onCancel?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate className="space-y-4">
      {fields.map((field) => {
        const errors = fieldErrors[field.name];
        const errorId = `${field.name}-error`;
        return (
          <div key={field.name} className="space-y-1.5">
            <label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              aria-invalid={errors ? true : undefined}
              aria-describedby={errors ? errorId : undefined}
              className={cn(
                "flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                errors && "border-destructive",
              )}
            />
            {errors ? (
              <p id={errorId} role="alert" className="text-xs text-destructive">
                {errors.join(" ")}
              </p>
            ) : null}
          </div>
        );
      })}
      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
