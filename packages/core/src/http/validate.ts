import { z } from "zod";
import { ValidationError, type FieldErrors } from "./errors";

export function parseWithSchema<S extends z.ZodType>(schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw new ValidationError("Validation failed", z.flattenError(result.error).fieldErrors as FieldErrors);
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}
