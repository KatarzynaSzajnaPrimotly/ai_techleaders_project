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
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
  type ErrorCode,
  type FieldErrors,
} from "./http/errors";
export { parseWithSchema, readJsonBody } from "./http/validate";
export { signPurposeToken, verifyPurposeToken, type PurposeToken } from "./http/tokens";
export { absoluteUrl } from "./config/absolute-url";
export { getGithubConfig, type GithubConfig } from "./config/github";
export { enforceAccess, type Access, type CurrentSessionResolver } from "./http/access";
export {
  apiHandler,
  created,
  ok,
  CSRF_HEADER,
  CSRF_VALUE,
  type ApiFailure,
  type ApiHandlerOptions,
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
export type { User, NewUser, StoredRole, PasswordAuthAccount, LoginAccount, ExistingAccountLookup, NewPasswordAccount } from "./services/auth/user.types";
export type { UserRepositoryPort } from "./services/auth/user-repository.port";
export { effectiveRole, issueSession, type IssuedSession } from "./services/auth/session-issuer";
export { AccountService, NoVerifiedGithubEmailError } from "./services/auth/account.service";
export { PasswordAuthService, REGISTRATION_TOKEN_TTL_SECONDS, type ConfirmRegistrationResult } from "./services/auth/password-auth.service";
export { createPasswordHasher, PASSWORD_HASH_COST, DUMMY_PASSWORD_HASH } from "./services/auth/password-hasher";
export type { PasswordHasherPort } from "./services/auth/password-hasher.port";
export { buildExistingAccountMail, buildRegistrationMail, type RegistrationMail } from "./services/auth/registration-mail";
export type { GithubEmail, GithubIdentityPort, GithubUser } from "./services/auth/github-identity.port";
export { createGithubIdentityAdapter, type GithubAdapterDependencies } from "./services/auth/adapters/github-identity.adapter";
export { createMemoryRateLimiter } from "./services/ratelimit/memory-rate-limiter.adapter";
export { enforceRateLimit } from "./services/ratelimit/enforce-rate-limit";
export { getTrustedClientIp } from "./services/ratelimit/client-ip";
export { loginRateLimitKeys } from "./services/ratelimit/rate-limit-keys";
export type { RateLimiterPort, RateLimitPolicy, RateLimitResult } from "./services/ratelimit/rate-limiter.port";
export { createLogMailerAdapter } from "./services/notifications/adapters/log-mailer.adapter";
export type { MailerPort, MailMessage } from "./services/notifications/mailer.port";
export { selectAdapter } from "./services/shared/select-adapter";
export {
  clearOAuthStateCookie,
  createOAuthState,
  readOAuthStateCookie,
  verifyOAuthState,
  type OAuthStateClaims,
  type OAuthStateIssue,
} from "./services/auth/oauth-state";

export { mentorCreateSchema, type MentorCreateInput } from "./validators";
