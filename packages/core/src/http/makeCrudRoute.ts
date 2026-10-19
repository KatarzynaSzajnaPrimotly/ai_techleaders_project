import type { z } from "zod";
import { apiHandler, created } from "./apiHandler";
import { MethodNotAllowedError } from "./errors";
import { parseWithSchema, readJsonBody } from "./validate";

export type CrudMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface CrudContext<C = unknown> {
  request: Request;
  context: C;
}

export interface CrudConfig<TCreate, TUpdate, C> {
  authorize?: (request: Request, method: CrudMethod) => Promise<void>;
  list?: (ctx: CrudContext<C>) => Promise<unknown>;
  create?: { schema: z.ZodType<TCreate>; run: (input: TCreate, ctx: CrudContext<C>) => Promise<unknown> };
  update?: { schema: z.ZodType<TUpdate>; run: (input: TUpdate, ctx: CrudContext<C>) => Promise<unknown> };
  remove?: (ctx: CrudContext<C>) => Promise<unknown>;
}

export function makeCrudRoute<TCreate = never, TUpdate = never, C = unknown>(
  config: CrudConfig<TCreate, TUpdate, C>,
) {
  const route = (method: CrudMethod, run: ((ctx: CrudContext<C>) => Promise<unknown>) | undefined) =>
    apiHandler<C>(async (request, context) => {
      if (!run) throw new MethodNotAllowedError();
      await config.authorize?.(request, method);
      return run({ request, context });
    });

  const withBody =
    <T>(entry: { schema: z.ZodType<T>; run: (input: T, ctx: CrudContext<C>) => Promise<unknown> } | undefined) =>
    entry &&
    (async (ctx: CrudContext<C>) => entry.run(parseWithSchema(entry.schema, await readJsonBody(ctx.request)), ctx));

  const createRun = withBody(config.create);

  return {
    GET: route("GET", config.list),
    POST: route("POST", createRun && (async (ctx) => created(await createRun(ctx)))),
    PUT: route("PUT", withBody(config.update)),
    DELETE: route("DELETE", config.remove),
  };
}
