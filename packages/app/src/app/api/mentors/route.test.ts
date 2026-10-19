import { beforeEach, describe, expect, it, vi } from "vitest";
import { MentorAlreadyExistsError, MentorValidationError } from "@devmentor/core";

const mocks = vi.hoisted(() => ({ list: vi.fn(), register: vi.fn() }));

vi.mock("../../../server/container", () => ({
  createRequestScope: async () => ({ cradle: { mentorService: { list: mocks.list, register: mocks.register } } }),
}));

import { GET, POST } from "./route";

function postRequest(body: unknown, raw = false) {
  return new Request("http://localhost/api/mentors", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.list.mockReset();
  mocks.register.mockReset();
});

describe("GET /api/mentors", () => {
  it("returns the mentors as JSON", async () => {
    mocks.list.mockResolvedValue([{ id: "1", name: "Ada" }]);
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([{ id: "1", name: "Ada" }]);
  });
});

describe("POST /api/mentors", () => {
  it("rejects a body that is not valid JSON", async () => {
    const response = await POST(postRequest("not json", true));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "name and email are required" });
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it.each([
    ["a null body", null],
    ["a missing name", { email: "a@b.co" }],
    ["a missing email", { name: "Ada" }],
    ["a non-string name", { name: 1, email: "a@b.co" }],
    ["a non-string email", { name: "Ada", email: 2 }],
  ])("rejects %s", async (_label, body) => {
    const response = await POST(postRequest(body));
    expect(response.status).toBe(400);
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it("creates a mentor and answers 201", async () => {
    mocks.register.mockResolvedValue({ id: "1", name: "Ada", email: "ada@example.com" });
    const response = await POST(postRequest({ name: "Ada", email: "ada@example.com" }));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({ id: "1" });
    expect(mocks.register).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" });
  });

  it("maps validation errors to 400", async () => {
    mocks.register.mockRejectedValue(new MentorValidationError("Mentor email is invalid"));
    const response = await POST(postRequest({ name: "Ada", email: "nope" }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Mentor email is invalid" });
  });

  it("maps duplicate mentors to 409", async () => {
    mocks.register.mockRejectedValue(new MentorAlreadyExistsError("ada@example.com"));
    const response = await POST(postRequest({ name: "Ada", email: "ada@example.com" }));
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: "A mentor with email ada@example.com already exists" });
  });

  it("hides unexpected errors behind a generic 500 and logs them", async () => {
    const failure = new Error("password=secret leaked");
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.register.mockRejectedValue(failure);
    const response = await POST(postRequest({ name: "Ada", email: "ada@example.com" }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Internal server error" });
    expect(log).toHaveBeenCalledWith(failure);
    log.mockRestore();
  });
});
