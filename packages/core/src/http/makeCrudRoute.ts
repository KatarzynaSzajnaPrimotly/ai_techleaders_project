import type { z } from "zod";
import type { Access } from "./access";
import { apiHandler, appErrorResponse, created } from "./apiHandler";
import type { Session } from "./auth";
import { MethodNotAllowedError } from "./errors";
import { parseWithSchema, readJsonBody } from "./validate";

export type CrudMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface CrudContext<C = unknown, A extends Access = "public"> {
  request: Request;
  context: C;
  session: A extends "public" ? Session | null : Session;
}

export interface CrudConfig<TCreate, TUpdate, C, A extends Access = Access> {
  access: A;
  list?: (ctx: CrudContext<C, A>) => Promise<unknown>;
  create?: { schema: z.ZodType<TCreate>; run: (input: TCreate, ctx: CrudContext<C, A>) => Promise<unknown> };
  update?: { schema: z.ZodType<TUpdate>; run: (input: TUpdate, ctx: CrudContext<C, A>) => Promise<unknown> };
  remove?: (ctx: CrudContext<C, A>) => Promise<unknown>;
}

export function makeCrudRoute<TCreate = never, TUpdate = never, C = unknown, A extends Access = Access>(
  config: CrudConfig<TCreate, TUpdate, C, A>,
) {
  const methodNotAllowed = async () => appErrorResponse(new MethodNotAllowedError());

  const route = (run: ((ctx: CrudContext<C, A>) => Promise<unknown>) | undefined) => {
    if (!run) return methodNotAllowed;

    return apiHandler<C, A>(
      async (request, context, session) => run({ request, context, session }),
      { access: config.access },
    );
  };

  const withBody = <T>(
    entry: { schema: z.ZodType<T>; run: (input: T, ctx: CrudContext<C, A>) => Promise<unknown> } | undefined,
  ) => entry && (async (ctx: CrudContext<C, A>) => entry.run(parseWithSchema(entry.schema, await readJsonBody(ctx.request)), ctx));

  const createRun = withBody(config.create);

  return {
    GET: route(config.list),
    POST: route(createRun && (async (ctx) => created(await createRun(ctx)))),
    PUT: route(withBody(config.update)),
    DELETE: route(config.remove),
  };
}
