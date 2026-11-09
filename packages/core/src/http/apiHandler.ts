import { logger } from "../logger";
import { enforceAccess, type Access, type CurrentSessionResolver } from "./access";
import type { Session } from "./auth";
import { AppError, ForbiddenError, TooManyRequestsError, type FieldErrors } from "./errors";

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

export type SessionForAccess<A extends Access> = A extends "public" ? Session | null : Session;
export type RouteHandler<C = unknown, A extends Access = "public"> = (
  request: Request,
  context: C,
  session: SessionForAccess<A>,
) => Promise<unknown>;

export interface ApiHandlerOptions<A extends Access> {
  access: A;
  csrf?: boolean;
  navigation?: (error: AppError) => Response;
  resolveCurrentSession?: CurrentSessionResolver;
}

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data } satisfies ApiSuccess<T>, { status });
}

export function created<T>(data: T): Response {
  return ok(data, 201);
}

function failure(status: number, error: ApiFailure["error"]): Response {
  return Response.json({ ok: false, error } satisfies ApiFailure, { status });
}

export function appErrorResponse(error: AppError): Response {
  const response = failure(error.status, {
    code: error.code,
    message: error.message,
    ...( "fieldErrors" in error && error.fieldErrors
      ? { fieldErrors: error.fieldErrors as FieldErrors }
      : {}),
  });
  if (error instanceof TooManyRequestsError) {
    response.headers.set("Retry-After", String(error.retryAfterSeconds));
  }
  return response;
}

export function apiHandler<C = unknown, A extends Access = Access>(
  handler: RouteHandler<C, A>,
  options: ApiHandlerOptions<A>,
) {
  const csrf = options.csrf ?? true;

  return async (request: Request, context: C): Promise<Response> => {
    try {
      if (csrf && !SAFE_METHODS.has(request.method) && request.headers.get(CSRF_HEADER) !== CSRF_VALUE) {
        throw new ForbiddenError("Missing CSRF header");
      }
      const session = await enforceAccess(request, options.access, options.resolveCurrentSession);
      const result = await handler(request, context, session as SessionForAccess<A>);
      return result instanceof Response ? result : ok(result);
    } catch (error) {
      if (error instanceof AppError) {
        if (options.navigation) return options.navigation(error);
        return appErrorResponse(error);
      }
      logger.error({ err: error }, "Unhandled error in route handler");
      return failure(500, { code: "INTERNAL_ERROR", message: "Internal server error" });
    }
  };
}
