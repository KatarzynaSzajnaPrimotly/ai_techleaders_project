<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## App package

- Read the relevant Next guide under `node_modules/next/dist/docs/` before changing Next.js code; the app runs Next 16.4 App Router.
- Route handlers and pages call services through `withScope()` from `@devmentor/core`; the composition root is `src/server/container.ts`.
- Use `apiHandler` or `makeCrudRoute` for APIs. Navigated OAuth and verification routes return redirects; fetched APIs use the `{ ok, data }` / `{ ok, error }` envelope through `apiCall`.
- Keep routes dynamic when they access the database. Pages use guarded/public page helpers and enforce access on the server.
- Run app-relevant unit/integration tests and `npm run build` for changes affecting the host or routes.
