import type { ApiErrorBody, ApiFieldErrors, ApiResult } from "./types";

// Same values as the server side check in @devmentor/core (ui must not import core, so the shape is duplicated).
const CSRF_HEADER = "x-devmentor-csrf";
const CSRF_VALUE = "1";

export interface ApiCallOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: ApiFieldErrors;

  constructor(status: number, error: ApiErrorBody) {
    super(error.message);
    this.name = "ApiError";
    this.status = status;
    this.code = error.code;
    this.fieldErrors = error.fieldErrors;
  }
}

export async function readJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

function failure(status: number, error: ApiErrorBody): ApiResult<never> {
  return { ok: false, status, error };
}

function parseEnvelope<T>(json: unknown, response: Response): ApiResult<T> {
  if (isRecord(json) && json.ok === true && "data" in json && response.ok) {
    return { ok: true, status: response.status, data: json.data as T };
  }
  if (isRecord(json) && json.ok === false && isRecord(json.error)) {
    const { code, message, fieldErrors } = json.error;
    if (typeof code === "string" && typeof message === "string") {
      return failure(response.status, { code, message, fieldErrors: fieldErrors as ApiFieldErrors | undefined });
    }
  }
  return failure(response.status, { code: "INVALID_RESPONSE", message: `Unexpected response (HTTP ${response.status})` });
}

export async function apiCall<T>(url: string, options: ApiCallOptions = {}): Promise<ApiResult<T>> {
  const { method = "GET", body, signal } = options;
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      credentials: "same-origin",
      headers: { [CSRF_HEADER]: CSRF_VALUE, ...(hasBody ? { "content-type": "application/json" } : {}) },
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    return failure(0, {
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Network request failed",
    });
  }

  return parseEnvelope<T>(await readJsonSafe(response), response);
}

export async function apiCallOrThrow<T>(url: string, options?: ApiCallOptions): Promise<T> {
  const result = await apiCall<T>(url, options);
  if (!result.ok) throw new ApiError(result.status, result.error);
  return result.data;
}
