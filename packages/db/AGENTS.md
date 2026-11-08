# Database package guidance

- Use MikroORM v7 with PostgreSQL. Define entities with `defineEntity` and `p`; do not use decorators.
- Put entities in `src/entities/<concept>/` and repositories in `src/repositories/<concept>/`. Keep tables and columns snake_case and plural.
- Generate and commit schema changes through migrations; never hand-edit schema state. Use `npm run db:migration:create -- --name <name>`, then review the generated migration.
- Translate database driver errors to typed core `AppError`s. PostgreSQL unique violation `23505` maps to `ConflictError`.
- `MikroORM.init()` does not connect in v7; `getOrm()` connects explicitly. Register entity schemas as global singletons and compare schemas by name across module graphs.
- Database changes require unit and integration coverage; integration tests own their database and data.
