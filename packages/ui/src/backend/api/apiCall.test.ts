import { afterEach, describe, expect, it, vi } from "vitest";
import { apiCall, apiCallOrThrow, ApiError, readJsonSafe } from "./apiCall";

const fetchMock = vi.fn();

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

function respond(body: unknown, status = 200, raw = false) {
  vi.stubGlobal("fetch", fetchMock);
  const noContent = status === 204;
  fetchMock.mockResolvedValue(new Response(noContent ? null : raw ? (body as string) : JSON.stringify(body), { status }));
}

describe("readJsonSafe", () => {
  it("parses JSON", async () => {
    await expect(readJsonSafe(new Response('{"a":1}'))).resolves.toEqual({ a: 1 });
  });

  it("returns null for an empty body", async () => {
    await expect(readJsonSafe(new Response(""))).resolves.toBeNull();
  });

  it("returns null instead of throwing for malformed JSON", async () => {
    await expect(readJsonSafe(new Response("<html>oops</html>"))).resolves.toBeNull();
  });
});

describe("apiCall", () => {
  it("returns data from a success envelope and always sends the CSRF header", async () => {
    respond({ ok: true, data: [{ id: "1" }] });
    const result = await apiCall<Array<{ id: string }>>("/api/mentors");
    expect(result).toEqual({ ok: true, status: 200, data: [{ id: "1" }] });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/mentors",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: { "x-devmentor-csrf": "1" },
        body: undefined,
      }),
    );
  });

  it("sends a JSON body with a content type", async () => {
    respond({ ok: true, data: { id: "1" } }, 201);
    const result = await apiCall("/api/mentors", { method: "POST", body: { name: "Ada" } });
    expect(result).toMatchObject({ ok: true, status: 201 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/mentors",
      expect.objectContaining({
        method: "POST",
        headers: { "x-devmentor-csrf": "1", "content-type": "application/json" },
        body: '{"name":"Ada"}',
      }),
    );
  });

  it("forwards the abort signal", async () => {
    respond({ ok: true, data: null });
    const controller = new AbortController();
    await apiCall("/api/x", { signal: controller.signal });
    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
  });

  it("returns the error body, including field errors, from a failure envelope", async () => {
    respond({ ok: false, error: { code: "VALIDATION_ERROR", message: "Bad", fieldErrors: { email: ["Invalid"] } } }, 400);
    await expect(apiCall("/api/mentors", { method: "POST", body: {} })).resolves.toEqual({
      ok: false,
      status: 400,
      error: { code: "VALIDATION_ERROR", message: "Bad", fieldErrors: { email: ["Invalid"] } },
    });
  });

  it("returns a failure without field errors when the server sends none", async () => {
    respond({ ok: false, error: { code: "CONFLICT", message: "Exists" } }, 409);
    const result = await apiCall("/api/mentors");
    expect(result).toEqual({
      ok: false,
      status: 409,
      error: { code: "CONFLICT", message: "Exists", fieldErrors: undefined },
    });
  });

  it.each([
    ["a non-JSON body", "<html>502</html>", 502, true],
    ["an empty body", "", 204, true],
    ["a JSON body that is not an envelope", { hello: "world" }, 200, false],
    ["an envelope with an error of the wrong shape", { ok: false, error: { code: 1, message: 2 } }, 500, false],
    ["a success envelope on a non-2xx response", { ok: true, data: 1 }, 500, false],
    ["an envelope missing its data", { ok: true }, 200, false],
  ])("reports an invalid response for %s", async (_label, body, status, raw) => {
    respond(body, status, raw);
    const result = await apiCall("/api/x");
    expect(result).toEqual({
      ok: false,
      status,
      error: { code: "INVALID_RESPONSE", message: `Unexpected response (HTTP ${status})` },
    });
  });

  it("turns a network failure into a result instead of throwing", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(apiCall("/api/x")).resolves.toEqual({
      ok: false,
      status: 0,
      error: { code: "NETWORK_ERROR", message: "Failed to fetch" },
    });
  });

  it("uses a generic message when a non-Error is thrown", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockRejectedValue("boom");
    await expect(apiCall("/api/x")).resolves.toMatchObject({
      error: { code: "NETWORK_ERROR", message: "Network request failed" },
    });
  });
});

describe("apiCallOrThrow", () => {
  it("returns the data directly", async () => {
    respond({ ok: true, data: { id: "1" } });
    await expect(apiCallOrThrow("/api/x")).resolves.toEqual({ id: "1" });
  });

  it("throws an ApiError carrying status, code and field errors", async () => {
    respond({ ok: false, error: { code: "VALIDATION_ERROR", message: "Bad", fieldErrors: { name: ["Required"] } } }, 400);
    const failure = apiCallOrThrow("/api/x", { method: "POST", body: {} });
    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({
      name: "ApiError",
      message: "Bad",
      status: 400,
      code: "VALIDATION_ERROR",
      fieldErrors: { name: ["Required"] },
    });
  });
});
