# Next.js bundles workspace packages once per route

With `transpilePackages`, `@devmentor/db` (TypeScript source) is bundled separately into each route chunk, so
module-level objects exist once per copy. The Awilix root container and the MikroORM instance live on
`globalThis` and are shared across routes, but `MentorSchema` is not: the repository in route B received a
different `EntitySchema` instance than the ORM was initialised with in route A. Symptoms depended on request
order: `Cannot set properties of undefined (setting '__schema')` and `Cannot read properties of undefined
(reading 'filter')`, giving 500s only when a different route had created the container first.

Fix: reference entities by name (`em.find("Mentor", ...)`), never by schema object identity, in code that runs
against a shared ORM. Marking `awilix` as a server-external package did not help.

When testing server state shared across routes, test several request orders (page first, API first), not one.
