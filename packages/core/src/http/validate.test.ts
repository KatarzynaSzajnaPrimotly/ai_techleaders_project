import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ValidationError } from "./errors";
import { parseWithSchema, readJsonBody } from "./validate";

const schema = z.object({ name: z.string().trim().min(1, "Name is required"), age: z.number().int() });

describe("parseWithSchema", () => {
  it("returns the parsed, transformed output and strips unknown keys", () => {
    expect(parseWithSchema(schema, { name: "  Ada ", age: 36, role: "admin" })).toEqual({ name: "Ada", age: 36 });
  });

  it("throws a ValidationError carrying per-field messages", () => {
    try {
      parseWithSchema(schema, { name: " ", age: 1.5 });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const { fieldErrors } = error as ValidationError;
      expect(fieldErrors?.name).toEqual(["Name is required"]);
      expect(fieldErrors?.age).toHaveLength(1);
    }
  });
});

describe("readJsonBody", () => {
  it("parses a JSON body", async () => {
    const request = new Request("http://x", { method: "POST", body: JSON.stringify({ a: 1 }) });
    await expect(readJsonBody(request)).resolves.toEqual({ a: 1 });
  });

  it("turns malformed JSON into a ValidationError", async () => {
    const request = new Request("http://x", { method: "POST", body: "{nope" });
    await expect(readJsonBody(request)).rejects.toMatchObject({
      name: "ValidationError",
      message: "Request body must be valid JSON",
    });
  });
});
