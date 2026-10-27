"use client";

import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import type { ApiResult } from "../../backend/api/types";
import { useFormCore } from "../../backend/forms/useFormCore";

export type PublicFieldType = "text" | "email" | "password";

export interface PublicField {
  name: string;
  label: string;
  type?: PublicFieldType;
  autoComplete?: string;
  placeholder?: string;
  hint?: ReactNode;
}

type PublicInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
type PublicFieldRenderer = (props: PublicInputProps) => ReactNode;

/** Each supported public field has an explicit Tailwind renderer. */
export const PUBLIC_FORM_FIELD_RENDERERS: Record<PublicFieldType, PublicFieldRenderer> = {
  text: (props) => <input {...props} type="text" />,
  email: (props) => <input {...props} type="email" />,
  password: (props) => <input {...props} type="password" />,
};

export function focusPublicField(form: HTMLFormElement, fieldName: string): void {
  const input = Array.from(form.elements).find(
    (element): element is HTMLInputElement => element instanceof HTMLInputElement && element.name === fieldName,
  );
  if (input) input.focus();
}

type PublicFailure = Extract<ApiResult<unknown>, { ok: false }>;

export interface PublicFormProps<S extends z.ZodType> {
  schema: S;
  fields: readonly PublicField[];
  submitLabel: string;
  busyLabel?: string;
  onSubmit: (values: z.output<S>) => Promise<ApiResult<unknown>>;
  onSuccess?: (data: unknown) => void;
  onCancel?: () => void;
  onErrorMessage?: (failure: PublicFailure) => string | undefined;
  formNote?: ReactNode;
  className?: string;
}

function retryDelayMessage(retryAfterSeconds: number | undefined): string {
  if (retryAfterSeconds === undefined) return "Too many attempts. Please try again later.";
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return `Too many attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
}

export function PublicForm<S extends z.ZodType>({
  schema,
  fields,
  submitLabel,
  busyLabel = "Saving…",
  onSubmit,
  onSuccess,
  onCancel,
  onErrorMessage,
  formNote,
  className,
}: PublicFormProps<S>) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    values,
    setValue,
    fieldErrors,
    formError,
    submitting,
    handleSubmit,
    handleKeyDown,
  } = useFormCore({
    schema,
    fields,
    onSubmit: async (input) => {
      const result = await onSubmit(input);
      if (result.ok) return result;
      const message = result.status === 429
        ? retryDelayMessage(result.retryAfterSeconds)
        : onErrorMessage?.(result) ?? result.error.message;
      return { ...result, error: { ...result.error, message } };
    },
    onSuccess,
    onCancel,
  });

  useEffect(() => {
    const firstInvalidField = fields.find((field) => fieldErrors[field.name]);
    if (!firstInvalidField) return;
    focusPublicField(formRef.current!, firstInvalidField.name);
  }, [fieldErrors, fields]);

  return (
    <form
      ref={formRef}
      className={cn("space-y-5", className)}
      noValidate
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      {fields.map((field) => {
        const id = `${formId}-${field.name}`;
        const hintId = field.hint ? `${id}-hint` : undefined;
        const errorId = `${id}-error`;
        const errors = fieldErrors[field.name];
        const FieldInput = PUBLIC_FORM_FIELD_RENDERERS[field.type ?? "text"];
        const descriptions = [hintId, errors ? errorId : undefined].filter(Boolean).join(" ") || undefined;

        return (
          <div key={field.name} className="space-y-2">
            <label htmlFor={id} className="block text-label font-medium text-text-strong">
              {field.label}
            </label>
            <FieldInput
              id={id}
              name={field.name}
              autoComplete={field.autoComplete ?? "off"}
              placeholder={field.placeholder}
              required
              value={values[field.name]}
              onChange={(event) => setValue(field.name, event.target.value)}
              aria-invalid={errors ? true : undefined}
              aria-describedby={descriptions}
              className={cn(
                "min-h-11 w-full rounded-control border border-stroke-control bg-surface-panel px-3 py-2 text-body text-text-strong",
                "placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary",
                errors && "border-status-error",
              )}
            />
            {field.hint ? <p id={hintId} className="m-0 text-meta text-text-muted">{field.hint}</p> : null}
            {errors ? (
              <p id={errorId} role="alert" className="m-0 text-meta text-status-error">
                {errors.join(" ")}
              </p>
            ) : null}
          </div>
        );
      })}
      {formError ? <p role="alert" className="m-0 text-body text-status-error">{formError}</p> : null}
      {formNote ? <div className="space-y-2">{formNote}</div> : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? busyLabel : submitLabel}
      </Button>
    </form>
  );
}
