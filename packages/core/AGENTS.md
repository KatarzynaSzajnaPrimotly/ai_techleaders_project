# Core package guidance

- Keep domain logic framework-agnostic. Core may depend on `db` contracts but must not import app, Next.js, React or UI.
- Services live in `src/services/<concept>/`; shared Zod schemas live in `src/validators/<concept>/`.
- Define repository ports in core and implement them in db. Services throw typed `AppError` subclasses and return DTOs, never HTTP responses.
- Resolve dependencies through the Awilix cradle. New services are registered explicitly in `packages/app/src/server/container.ts`.
- Events use typed IDs `concept.entity.action` and the in-process emitter; do not introduce a queue/worker.
- Cover changed behavior with adjacent unit tests; use `npm run test:coverage` for the repository coverage gate.
