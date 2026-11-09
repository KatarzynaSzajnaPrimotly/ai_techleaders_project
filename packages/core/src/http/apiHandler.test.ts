import { beforeEach, describe, expect, it, vi } from "vitest";

const log = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock("../logger", () => ({ logger: log }));

import { apiHandler, created, CSRF_HEADER, CSRF_VALUE, ok } from "./apiHandler";
import { ConflictError, ForbiddenError, TooManyRequestsError, ValidationError } from "./errors";
import { UnauthorizedError } from "./errors";
import { signSession, SESSION_COOKIE, type Session } from "./auth";

const get = () => new Request("http://x/api", { method: "GET" });
const post = (headers: Record<string, string> = {}) => new Request("http://x/api", { method: "POST", headers });

beforeEach(() => {
  log.error.mockReset();
});

describe("response helpers", () => {
  it("wraps data in a success envelope", async () => {
    const response = ok({ a: 1 });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { a: 1 } });
  });

  it("answers 201 for created resources", async () => {
    const response = created({ id: "1" });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { id: "1" } });
  });
});

describe("apiHandler", () => {
  it("wraps a returned value in the success envelope and passes the context through", async () => {
    const handler = vi.fn(async (_request: Request, context: { id: string }) => ({ id: context.id }));
    const response = await apiHandler(handler, { access: "public" })(get(), { id: "7" });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { id: "7" } });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("returns a Response from the handler untouched", async () => {
    const custom = new Response("raw", { status: 202 });
    const response = await apiHandler(async () => custom, { access: "public" })(get(), undefined);
    expect(response).toBe(custom);
  });

  it("maps an AppError to its status and code", async () => {
    const response = await apiHandler(async () => {
      throw new ConflictError("Already exists");
    }, { access: "public" })(get(), undefined);
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "CONFLICT", message: "Already exists" },
    });
    expect(log.error).not.toHaveBeenCalled();
  });

  it("maps rate limits to 429 and includes Retry-After", async () => {
    const response = await apiHandler(async () => {
      throw new TooManyRequestsError(42);
    }, { access: "public" })(get(), undefined);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "RATE_LIMITED", message: "Too many requests" },
    });
  });

  it("includes field errors for validation failures", async () => {
    const response = await apiHandler(async () => {
      throw new ValidationError("Validation failed", { email: ["Email is invalid"] });
    }, { access: "public" })(get(), undefined);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Validation failed", fieldErrors: { email: ["Email is invalid"] } },
    });
  });

  it("omits field errors when a validation error has none", async () => {
    const response = await apiHandler(async () => {
      throw new ValidationError("Bad body");
    }, { access: "public" })(get(), undefined);
    const body = (await response.json()) as { error: Record<string, unknown> };
    expect(body.error).not.toHaveProperty("fieldErrors");
  });

  it("hides unexpected errors behind a generic 500 and logs them", async () => {
    const failure = new Error("password=hunter2 leaked in a stack trace");
    const response = await apiHandler(async () => {
      throw failure;
    }, { access: "public" })(get(), undefined);
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).not.toContain("hunter2");
    expect(JSON.parse(text)).toEqual({ ok: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    expect(log.error).toHaveBeenCalledWith({ err: failure }, "Unhandled error in route handler");
  });

  it("rejects state-changing requests without the CSRF header", async () => {
    const handler = vi.fn(async () => "never");
    const response = await apiHandler(handler, { access: "public" })(post(), undefined);
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "FORBIDDEN", message: "Missing CSRF header" } });
    expect(handler).not.toHaveBeenCalled();
  });

  it("rejects a wrong CSRF header value", async () => {
    const response = await apiHandler(async () => "never", { access: "public" })(post({ [CSRF_HEADER]: "0" }), undefined);
    expect(response.status).toBe(403);
  });

  it("accepts state-changing requests carrying the CSRF header", async () => {
    const response = await apiHandler(async () => "fine", { access: "public" })(post({ [CSRF_HEADER]: CSRF_VALUE }), undefined);
    expect(response.status).toBe(200);
  });

  it("does not require the header for safe methods", async () => {
    expect((await apiHandler(async () => "fine", { access: "public" })(get(), undefined)).status).toBe(200);
  });

  it("can opt out of the CSRF check", async () => {
    const response = await apiHandler(async () => "fine", { access: "public", csrf: false })(post(), undefined);
    expect(response.status).toBe(200);
  });

  it("passes through errors thrown by authorization as their own status", async () => {
    const response = await apiHandler(async () => {
      throw new ForbiddenError();
    }, { access: "public" })(get(), undefined);
    expect(response.status).toBe(403);
  });

  it("passes the verified optional session to a public handler", async () => {
    const secret = "s".repeat(32);
    vi.stubEnv("JWT_SECRET", secret);
    const session = { userId: "user-1", role: "mentee" as const, sessionVersion: 0 };
    const token = await signSession(session, secret);
    const handler = vi.fn(async (_request: Request, _context: undefined, currentSession: Session | null) => currentSession);
    const request = new Request("http://x/api", { headers: { cookie: `${SESSION_COOKIE}=${token}` } });

    const response = await apiHandler(handler, { access: "public" })(request, undefined);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: session });
    expect(handler).toHaveBeenCalledWith(request, undefined, session);
  });

  it("requires a session for guarded handlers", async () => {
    vi.stubEnv("JWT_SECRET", "s".repeat(32));
    const handler = vi.fn(async () => "unreachable");
    const response = await apiHandler(handler, { access: "authenticated", resolveCurrentSession: async (session) => session })(get(), undefined);

    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it("checks CSRF before access for guarded state-changing routes", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const response = await apiHandler(async () => "unreachable", {
      access: "authenticated",
      resolveCurrentSession: async (session) => session,
    })(post(), undefined);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: { message: "Missing CSRF header" } });
  });

  it("uses navigation mapping for typed route errors", async () => {
    vi.stubEnv("JWT_SECRET", "s".repeat(32));
    const navigation = vi.fn((error: UnauthorizedError) =>
      Response.redirect(new URL(`/sign-in?error=${error.code}`, "http://x"), 307),
    );
    const response = await apiHandler(async () => "unreachable", {
      access: "authenticated",
      navigation,
      resolveCurrentSession: async (session) => session,
    })(get(), undefined);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://x/sign-in?error=UNAUTHORIZED");
    expect(navigation).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
