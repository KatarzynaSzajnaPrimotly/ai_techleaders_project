import { makeCrudRoute, mentorCreateSchema } from "@devmentor/core";
import { withScope } from "../../../server/container";
import { resolveCurrentSession } from "../../../server/current-session";

export const dynamic = "force-dynamic";

export const { GET, POST } = makeCrudRoute({
  access: { roles: ["operator"] },
  resolveCurrentSession,
  list: () => withScope(({ mentorService }) => mentorService.list()),
  create: {
    schema: mentorCreateSchema,
    run: (input) => withScope(({ mentorService }) => mentorService.register(input)),
  },
});
