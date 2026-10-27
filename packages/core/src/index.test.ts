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
    "absoluteUrl",
    "getGithubConfig",
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
    "TooManyRequestsError",
    "parseWithSchema",
    "readJsonBody",
    "signPurposeToken",
    "verifyPurposeToken",
    "effectiveRole",
    "issueSession",
    "AccountService",
    "NoVerifiedGithubEmailError",
    "createGithubIdentityAdapter",
    "createMemoryRateLimiter",
    "enforceRateLimit",
    "getTrustedClientIp",
    "loginRateLimitKeys",
    "createLogMailerAdapter",
    "selectAdapter",
    "createOAuthState",
    "verifyOAuthState",
    "readOAuthStateCookie",
    "clearOAuthStateCookie",
    "enforceAccess",
    "apiHandler",
    "created",
    "ok",
    "makeCrudRoute",
    "assertOwns",
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
