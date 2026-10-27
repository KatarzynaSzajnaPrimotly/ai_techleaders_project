"use client";

import { z } from "zod";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import type { ApiResult } from "../api/types";
import { useFormCore } from "./useFormCore";

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

export function CrudForm<S extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: CrudFormProps<S>) {
  const { values, setValue, fieldErrors, formError, submitting, handleSubmit, handleKeyDown } = useFormCore({
    schema,
    fields,
    onSubmit,
    onSuccess,
    onCancel,
  });

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
              onChange={(event) => setValue(field.name, event.target.value)}
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
