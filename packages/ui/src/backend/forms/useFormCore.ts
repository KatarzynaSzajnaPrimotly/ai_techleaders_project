import { useState, type FormEvent, type KeyboardEvent } from "react";
import { z } from "zod";
import type { ApiResult } from "../api/types";

type FieldErrors = Record<string, string[]>;

export interface FormCoreField {
  name: string;
}

export interface UseFormCoreOptions<S extends z.ZodType> {
  schema: S;
  fields: readonly FormCoreField[];
  onSubmit: (values: z.output<S>) => Promise<ApiResult<unknown>>;
  onSuccess?: (data: unknown) => void;
  onCancel?: () => void;
}

export function useFormCore<S extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  onSuccess,
  onCancel,
}: UseFormCoreOptions<S>) {
  const emptyValues = () => Object.fromEntries(fields.map((field) => [field.name, ""]));
  const [values, setValues] = useState<Record<string, string>>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

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

  return { values, setValue, fieldErrors, formError, submitting, handleSubmit, handleKeyDown };
}
