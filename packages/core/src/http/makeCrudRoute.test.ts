import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const log = vi.hoisted(() => ({ error: vi.fn(), warn: vi.fn() }));
vi.mock("../logger", () => ({ logger: log }));

import { CSRF_HEADER, CSRF_VALUE } from "./apiHandler";
import { signSession, SESSION_COOKIE } from "./auth";
import { makeCrudRoute } from "./makeCrudRoute";

const schema = z.object({ name: z.string().trim().min(1, "Name is required") });
const headers = { [CSRF_HEADER]: CSRF_VALUE, "content-type": "application/json" };
const send = (method: string, body?: unknown) =>
  new Request("http://x/api", { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });

const list = vi.fn();
const create = vi.fn();
const update = vi.fn();
const remove = vi.fn();

function buildRoute(access: "public" | "authenticated" = "public") {
  return makeCrudRoute({
    access,
    resolveCurrentSession: async (session) => session,
    list,
    create: { schema, run: create },
    update: { schema, run: update },
    remove,
  });
}

beforeEach(() => {
  [list, create, update, remove].forEach((mock) => mock.mockReset());
  log.warn.mockReset();
  vi.stubEnv("JWT_SECRET", "s".repeat(32));
});

describe("makeCrudRoute", () => {
  it("lists through GET and passes the session in CRUD context", async () => {
    list.mockResolvedValue([{ id: "1" }]);
    const session = { userId: "user-1", role: "mentee" as const, sessionVersion: 0 };
    const token = await signSession(session, "s".repeat(32));
    const request = new Request("http://x/api", { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
    const response = await buildRoute().GET(request, { params: "p" });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: [{ id: "1" }] });
    expect(list).toHaveBeenCalledWith({ request, context: { params: "p" }, session });
  });

  it("passes the verified session to guarded CRUD callbacks", async () => {
    const session = { userId: "user-2", role: "mentor" as const, sessionVersion: 0 };
    const token = await signSession(session, "s".repeat(32));
    const request = new Request("http://x/api", { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
    list.mockResolvedValue([]);
    const response = await buildRoute("authenticated").GET(request, undefined);
    expect(response.status).toBe(200);
    expect(list).toHaveBeenCalledWith({ request, context: undefined, session });
  });

  it("creates through POST: parses the body, then answers 201", async () => {
    create.mockResolvedValue({ id: "1", name: "Ada" });
    const response = await buildRoute().POST(send("POST", { name: "  Ada ", role: "admin" }), undefined);
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { id: "1", name: "Ada" } });
    expect(create).toHaveBeenCalledWith({ name: "Ada" }, expect.objectContaining({ request: expect.any(Request), session: null }));
  });

  it("rejects an invalid body with field errors and does not run the action", async () => {
    const response = await buildRoute().POST(send("POST", { name: " " }), undefined);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "VALIDATION_ERROR", fieldErrors: { name: ["Name is required"] } },
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects a malformed JSON body", async () => {
    const request = new Request("http://x/api", { method: "POST", headers, body: "{nope" });
    const response = await buildRoute().POST(request, undefined);
    expect(response.status).toBe(400);
  });

  it("updates through PUT", async () => {
    update.mockResolvedValue({ id: "1", name: "Grace" });
    const response = await buildRoute().PUT(send("PUT", { name: "Grace" }), undefined);
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ name: "Grace" }, expect.objectContaining({ session: null }));
  });

  it("removes through DELETE", async () => {
    remove.mockResolvedValue({ removed: true });
    const response = await buildRoute().DELETE(send("DELETE"), undefined);
    expect(response.status).toBe(200);
    expect(remove).toHaveBeenCalledWith(expect.objectContaining({ session: null }));
  });

  it("checks CSRF before access for configured state-changing methods", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const request = new Request("http://x/api", { method: "POST", body: JSON.stringify({ name: "Ada" }) });
    const response = await buildRoute("authenticated").POST(request, undefined);
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: { message: "Missing CSRF header" } });
    expect(create).not.toHaveBeenCalled();
  });

  it("answers 405 for unconfigured methods before CSRF or access", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const route = makeCrudRoute({ access: "public", list });
    for (const method of ["POST", "PUT", "DELETE"] as const) {
      const response = await route[method](new Request("http://x/api", { method }), undefined);
      expect(response.status).toBe(405);
      await expect(response.json()).resolves.toMatchObject({ error: { code: "METHOD_NOT_ALLOWED" } });
    }
  });

  it("returns 405 without reading access config for an unconfigured method with a cookie", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const route = makeCrudRoute({ access: "public", list });
    const request = new Request("http://x/api", { method: "POST", headers: { cookie: "devmentor_session=invalid" } });

    const response = await route.POST(request, undefined);

    expect(response.status).toBe(405);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" },
    });
    expect(log.warn).not.toHaveBeenCalled();
  });

  it("requires access for configured methods after CSRF passes", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const request = send("POST", { name: "Ada" });
    const response = await buildRoute("authenticated").POST(request, undefined);
    expect(response.status).toBe(503);
    expect(create).not.toHaveBeenCalled();
  });
});
