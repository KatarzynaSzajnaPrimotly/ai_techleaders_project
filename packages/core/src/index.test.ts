import { describe, expect, it } from "vitest";
import * as core from "./index";

describe("@devmentor/core public API", () => {
  it("exposes the app name", () => {
    expect(core.APP_NAME).toBe("DevMentor");
  });

  it.each([
    "parseEnv",
    "requireJwtSecret",
    "requireConfig",
    "isInsecureHttpAllowed",
    "createLogger",
    "logger",
    "AppError",
    "ConflictError",
    "ForbiddenError",
    "MethodNotAllowedError",
    "NotFoundError",
    "UnauthorizedError",
    "ValidationError",
    "ServiceUnavailableError",
    "parseWithSchema",
    "readJsonBody",
    "apiHandler",
    "created",
    "ok",
    "makeCrudRoute",
    "assertOwns",
    "requireRole",
    "requireSession",
    "signSession",
    "verifySession",
    "isRole",
    "buildSessionCookie",
    "clearSessionCookie",
    "MentorService",
    "SUBJECTS",
    "FEATURED_TUTORS",
    "mentorCreateSchema",
  ])("exports %s", (name) => {
    expect(core).toHaveProperty(name);
  });
});
