import { describe, expect, it } from "vitest";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

describe("AppError hierarchy", () => {
  it.each([
    [UnauthorizedError, "UNAUTHORIZED", 401, "Authentication required"],
    [ForbiddenError, "FORBIDDEN", 403, "Forbidden"],
    [NotFoundError, "NOT_FOUND", 404, "Not found"],
    [MethodNotAllowedError, "METHOD_NOT_ALLOWED", 405, "Method not allowed"],
    [ConflictError, "CONFLICT", 409, "Conflict"],
    [ValidationError, "VALIDATION_ERROR", 400, "Validation failed"],
  ] as const)("%o maps to a code, status and default message", (ErrorClass, code, status, message) => {
    const error = new ErrorClass();
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe(code);
    expect(error.status).toBe(status);
    expect(error.message).toBe(message);
    expect(error.name).toBe(ErrorClass.name);
  });

  it("accepts a custom message", () => {
    expect(new NotFoundError("Mentor 7 not found").message).toBe("Mentor 7 not found");
  });

  it("carries field errors on validation errors", () => {
    const error = new ValidationError("Bad", { email: ["Email is invalid"] });
    expect(error.fieldErrors).toEqual({ email: ["Email is invalid"] });
  });

  it("has no field errors unless given", () => {
    expect(new ValidationError().fieldErrors).toBeUndefined();
  });
});
