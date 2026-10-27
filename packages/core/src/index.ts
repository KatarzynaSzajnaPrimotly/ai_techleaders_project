export const APP_NAME = "DevMentor";

export { FEATURED_TUTORS, SUBJECTS, type Tutor, type TutorBadge } from "./catalog";

export { isInsecureHttpAllowed, parseEnv, requireConfig, requireJwtSecret, type Env } from "./config/env";
export { createLogger, logger, REDACTED_PATHS } from "./logger";

export {
  AppError,
  ConflictError,
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
  ValidationError,
  type ErrorCode,
  type FieldErrors,
} from "./http/errors";
export { parseWithSchema, readJsonBody } from "./http/validate";
export { signPurposeToken, verifyPurposeToken, type PurposeToken } from "./http/tokens";
export { absoluteUrl } from "./config/absolute-url";
export { getGithubConfig, type GithubConfig } from "./config/github";
export { enforceAccess, type Access } from "./http/access";
export {
  apiHandler,
  created,
  ok,
  CSRF_HEADER,
  CSRF_VALUE,
  type ApiFailure,
  type ApiSuccess,
  type RouteHandler,
} from "./http/apiHandler";
export { makeCrudRoute, type CrudConfig, type CrudContext, type CrudMethod } from "./http/makeCrudRoute";
export {
  assertOwns,
  buildSessionCookie,
  clearSessionCookie,
  isRole,
  signSession,
  verifySession,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  type Session,
  type Role,
} from "./http/auth";

export type { Mentor, NewMentor } from "./services/mentors/mentor.types";
export type { MentorRepositoryPort } from "./services/mentors/mentor-repository.port";
export { MentorService } from "./services/mentors/mentor.service";
export type { User, NewUser, StoredRole } from "./services/auth/user.types";
export type { UserRepositoryPort } from "./services/auth/user-repository.port";
export { effectiveRole, issueSession, type IssuedSession } from "./services/auth/session-issuer";
export type { GithubEmail, GithubIdentityPort, GithubUser } from "./services/auth/github-identity.port";
export { createGithubIdentityAdapter, type GithubAdapterDependencies } from "./services/auth/adapters/github-identity.adapter";
export {
  clearOAuthStateCookie,
  createOAuthState,
  readOAuthStateCookie,
  verifyOAuthState,
  type OAuthStateClaims,
  type OAuthStateIssue,
} from "./services/auth/oauth-state";

export { mentorCreateSchema, type MentorCreateInput } from "./validators";
