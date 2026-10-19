import { logger } from "../logger";
import { AppError, ForbiddenError, type FieldErrors } from "./errors";

export const CSRF_HEADER = "x-devmentor-csrf";
export const CSRF_VALUE = "1";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: { code: string; message: string; fieldErrors?: FieldErrors };
}

export type RouteHandler<C = unknown> = (request: Request, context: C) => Promise<unknown>;

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data } satisfies ApiSuccess<T>, { status });
}

export function created<T>(data: T): Response {
  return ok(data, 201);
}

function failure(status: number, error: ApiFailure["error"]): Response {
  return Response.json({ ok: false, error } satisfies ApiFailure, { status });
}

export function apiHandler<C = unknown>(handler: RouteHandler<C>, options: { csrf?: boolean } = {}) {
  const csrf = options.csrf ?? true;

  return async (request: Request, context: C): Promise<Response> => {
    try {
      if (csrf && !SAFE_METHODS.has(request.method) && request.headers.get(CSRF_HEADER) !== CSRF_VALUE) {
        throw new ForbiddenError("Missing CSRF header");
      }
      const result = await handler(request, context);
      return result instanceof Response ? result : ok(result);
    } catch (error) {
      if (error instanceof AppError) {
        return failure(error.status, {
          code: error.code,
          message: error.message,
          ...("fieldErrors" in error && error.fieldErrors ? { fieldErrors: error.fieldErrors as FieldErrors } : {}),
        });
      }
      logger.error({ err: error }, "Unhandled error in route handler");
      return failure(500, { code: "INTERNAL_ERROR", message: "Internal server error" });
    }
  };
}
