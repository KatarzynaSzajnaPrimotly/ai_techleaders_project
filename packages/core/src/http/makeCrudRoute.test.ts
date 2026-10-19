import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.mock("../logger", () => ({ logger: { error: vi.fn() } }));

import { CSRF_HEADER, CSRF_VALUE } from "./apiHandler";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { makeCrudRoute } from "./makeCrudRoute";

const schema = z.object({ name: z.string().trim().min(1, "Name is required") });
const headers = { [CSRF_HEADER]: CSRF_VALUE, "content-type": "application/json" };
const send = (method: string, body?: unknown) =>
  new Request("http://x/api", { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });

const list = vi.fn();
const create = vi.fn();
const update = vi.fn();
const remove = vi.fn();
const authorize = vi.fn();

function buildRoute() {
  return makeCrudRoute({
    authorize,
    list,
    create: { schema, run: create },
    update: { schema, run: update },
    remove,
  });
}

beforeEach(() => {
  [list, create, update, remove, authorize].forEach((mock) => mock.mockReset());
  authorize.mockResolvedValue(undefined);
});

describe("makeCrudRoute", () => {
  it("lists through GET and authorizes first", async () => {
    list.mockResolvedValue([{ id: "1" }]);
    const response = await buildRoute().GET(send("GET"), { params: "p" });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: [{ id: "1" }] });
    expect(authorize).toHaveBeenCalledWith(expect.any(Request), "GET");
    expect(list).toHaveBeenCalledWith({ request: expect.any(Request), context: { params: "p" } });
  });

  it("creates through POST: parses the body, then answers 201", async () => {
    create.mockResolvedValue({ id: "1", name: "Ada" });
    const response = await buildRoute().POST(send("POST", { name: "  Ada ", role: "admin" }), undefined);
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { id: "1", name: "Ada" } });
    expect(create).toHaveBeenCalledWith({ name: "Ada" }, expect.objectContaining({ request: expect.any(Request) }));
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
    expect(update).toHaveBeenCalledWith({ name: "Grace" }, expect.anything());
  });

  it("removes through DELETE", async () => {
    remove.mockResolvedValue({ removed: true });
    const response = await buildRoute().DELETE(send("DELETE"), undefined);
    expect(response.status).toBe(200);
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("requires the CSRF header on state-changing methods", async () => {
    const request = new Request("http://x/api", { method: "POST", body: JSON.stringify({ name: "Ada" }) });
    const response = await buildRoute().POST(request, undefined);
    expect(response.status).toBe(403);
    expect(create).not.toHaveBeenCalled();
  });

  it.each([
    ["unauthenticated", new UnauthorizedError(), 401],
    ["forbidden", new ForbiddenError(), 403],
  ])("denies when authorization fails (%s) without running the action", async (_label, error, status) => {
    authorize.mockRejectedValue(error);
    const response = await buildRoute().POST(send("POST", { name: "Ada" }), undefined);
    expect(response.status).toBe(status);
    expect(create).not.toHaveBeenCalled();
  });

  it("answers 405 for methods that are not configured", async () => {
    const route = makeCrudRoute({ list });
    for (const handler of [route.POST, route.PUT, route.DELETE]) {
      const response = await handler(send("POST", { name: "x" }), undefined);
      expect(response.status).toBe(405);
      await expect(response.json()).resolves.toMatchObject({ error: { code: "METHOD_NOT_ALLOWED" } });
    }
  });

  it("works without an authorize hook", async () => {
    list.mockResolvedValue([]);
    const response = await makeCrudRoute({ list }).GET(send("GET"), undefined);
    expect(response.status).toBe(200);
  });
});
