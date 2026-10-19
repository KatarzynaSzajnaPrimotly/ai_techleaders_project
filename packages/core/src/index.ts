export const APP_NAME = "DevMentor";

export { FEATURED_TUTORS, SUBJECTS, type Tutor, type TutorBadge } from "./catalog";

export { parseEnv, requireJwtSecret, type Env } from "./config/env";
export { createLogger, logger, REDACTED_PATHS } from "./logger";

export {
  AppError,
  ConflictError,
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  type ErrorCode,
  type FieldErrors,
} from "./http/errors";
export { parseWithSchema, readJsonBody } from "./http/validate";
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
  requireRole,
  requireSession,
  signSession,
  verifySession,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  type Session,
} from "./http/auth";

export type { Mentor, NewMentor } from "./services/mentors/mentor.types";
export type { MentorRepositoryPort } from "./services/mentors/mentor-repository.port";
export { MentorService } from "./services/mentors/mentor.service";

export { mentorCreateSchema, type MentorCreateInput } from "./validators";
