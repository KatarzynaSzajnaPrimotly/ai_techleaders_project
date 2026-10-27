# Keep config parsing independent from logger setup

While adding a config helper that logs a deployment warning, importing the shared
logger into `config/env.ts` would create an ESM cycle: `logger.ts` imported
`parseEnv` from `env.ts` and created its logger at module load. Importing config
directly could then call `parseEnv` before `env.ts` had initialized its schema.

Keep the Zod schema and pure `parseEnv` function in `config/env-schema.ts`. The
logger and config helpers can both import that module; `env.ts` can then use the
shared logger without a cycle. When changing config/logger dependencies, test
both the normal package import and a direct import of the config module.
