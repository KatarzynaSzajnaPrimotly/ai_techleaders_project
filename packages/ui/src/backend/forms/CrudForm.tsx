"use client";

import { z } from "zod";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import type { ApiResult } from "../api/types";
import { useFormCore, type FormCoreField } from "./useFormCore";

export interface CrudField extends FormCoreField {
  label: string;
  type?: "text" | "email" | "password" | "textarea" | "multiselect";
  placeholder?: string;
  options?: readonly { label: string; value: string }[];
  maxLength?: number;
}

export interface CrudFormProps<S extends z.ZodType> {
  schema: S;
  fields: CrudField[];
  onSubmit: (values: z.output<S>) => Promise<ApiResult<unknown>>;
  onSuccess?: (data: unknown) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  resetOnSuccess?: boolean;
  serverFieldErrors?: Record<string, string[]>;
}

export function CrudForm<S extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  resetOnSuccess = true,
  serverFieldErrors = {},
}: CrudFormProps<S>) {
  const { values, setValue, fieldErrors, formError, submitting, handleSubmit, handleKeyDown } = useFormCore({
    schema,
    fields,
    onSubmit,
    onSuccess,
    onCancel,
    resetOnSuccess,
  });

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate className="space-y-4">
      {fields.map((field) => {
        const errors = fieldErrors[field.name] ?? serverFieldErrors[field.name];
        const errorId = `${field.name}-error`;
        return (
          <div key={field.name} className="space-y-1.5">
            {field.type === "multiselect" ? (
              <span id={`${field.name}-label`} className="text-sm font-medium">{field.label}</span>
            ) : (
              <label htmlFor={field.name} className="text-sm font-medium">{field.label}</label>
            )}
            {field.type === "multiselect" ? (
              <fieldset aria-labelledby={`${field.name}-label`} aria-describedby={errors ? errorId : undefined}>
                <legend className="sr-only">{field.label}</legend>
                <div className="flex flex-wrap gap-3">
                  {(field.options ?? []).map((option) => {
                    const selected = Array.isArray(values[field.name]) ? values[field.name] as string[] : [];
                    return (
                      <label key={option.value} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option.value}
                          checked={selected.includes(option.value)}
                          aria-invalid={errors ? true : undefined}
                          aria-describedby={errors ? errorId : undefined}
                          onChange={(event) => setValue(field.name, event.target.checked
                            ? [...selected, option.value]
                            : selected.filter((value) => value !== option.value))}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                value={typeof values[field.name] === "string" ? values[field.name] as string : ""}
                onChange={(event) => setValue(field.name, event.target.value)}
                aria-invalid={errors ? true : undefined}
                aria-describedby={errors ? errorId : undefined}
                className={cn("min-h-28 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", errors && "border-destructive")}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                value={typeof values[field.name] === "string" ? values[field.name] as string : ""}
                onChange={(event) => setValue(field.name, event.target.value)}
                aria-invalid={errors ? true : undefined}
                aria-describedby={errors ? errorId : undefined}
                className={cn("flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", errors && "border-destructive")}
              />
            )}
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
