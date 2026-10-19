# Keep server-only dependencies out of client components

`@devmentor/core` bundles `pino` (logger) and `jose` (sessions). A client component importing the barrel
(`import { mentorCreateSchema } from "@devmentor/core"`) would drag them into the browser bundle. Client code imports
shared schemas from the subpath `@devmentor/core/validators` (package `exports`), which only depends on `zod`.

Related gotchas from the same change:
- `no-restricted-globals` does not catch `window.fetch`; add `no-restricted-properties` for `window` and `globalThis`.
- A pino redaction test must use secret values that are not substrings of the key names (`tok` is inside `token`).
- Do not synchronously `setState` inside `useEffect`; start from a loading state and set results in the promise callback,
  and use an `active` flag so a response arriving after unmount is ignored (and test that branch).
- `new Response("...", { status: 204 })` throws; pass `null` as the body for 204.
