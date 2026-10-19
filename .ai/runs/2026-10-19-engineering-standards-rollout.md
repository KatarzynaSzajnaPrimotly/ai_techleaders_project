# Run: engineering standards rollout

Spec: `.ai/specs/engineering-standards.md` (standing document) via `.ai/specs/implemented/2026-10-19-engineering-standards-rollout.md`.

## Input
The standards document was not attached on the first attempt (searched the workspace and attachments, found nothing and
asked for it). On retry it appeared as `.ai/specs/2026-09-01-engineering-standards.md`; it was already Markdown and was
renamed (content verbatim) to `.ai/specs/engineering-standards.md`. An "Implementation notes" section was appended.

## Done
- core: `http/{errors,apiHandler,makeCrudRoute,auth,validate}`, `config/env.ts` (zod), `logger.ts` (pino with redaction),
  `services/mentors/*` (service, types, `MentorRepositoryPort`), `validators/mentors/mentor-create.schema.ts`,
  subpath `@devmentor/core/validators`. Mentor-specific errors replaced by `ValidationError`/`ConflictError`.
- db: `entities/mentors/mentor.entity.ts`, `repositories/mentors/mentor.repository.ts` (23505 -> `ConflictError`).
- ui: shadcn primitives in `components/ui`, `components/mentors/mentor-card`, `backend/{api/apiCall,forms/CrudForm,
  tables/DataTable,feedback/*}`.
- app: `withScope`, `/api/mentors` via `makeCrudRoute` (envelope, CSRF header), `/admin/mentors` rebuilt on `apiCall`,
  `DataTable` and `CrudForm` (list plus an add-mentor form).
- ESLint: `no-explicit-any`, `no-empty`, `no-console`, no raw `fetch`/`window.fetch` outside `apiCall` (each proven with
  temporary violations). AGENTS.md sections added (concept convention, reusable layer, standards summary); README updated.

## Deliberate deviations (details in the rollout spec)
- Dependency direction kept as `db -> core` with repository ports (the document assumes `core -> db`).
- No events, no other concept folders, no password hashing or rate limiting, no persona route groups (YAGNI, step order).
- Existing routes stay public: authentication was deferred by the owner, so `POST /api/mentors` and `/admin/*` are an
  open blocker against the standards' own checklist.
- API change: all `/api/*` responses use the `{ ok, data | error }` envelope; POST requires `x-devmentor-csrf: 1`.

## Incident
A parallel session (`workspace-f4`, Mentora homepage) was editing the same tree. My rewrite of `core/src/index.ts` and
`ui/src/index.ts` dropped its exports; caught by the barrel unit test, restored, lesson recorded. Its files were not
otherwise touched. The peer could not be messaged.

## Verification
- Lint, typecheck, `npm run test:coverage`: pass; 41 files, 260 tests, 100% (487 statements, 209 branches, 136 functions,
  447 lines). Integration (local PostgreSQL, real Chrome via agent-browser): 12/12, including adding a mentor through the
  admin form in the browser.
