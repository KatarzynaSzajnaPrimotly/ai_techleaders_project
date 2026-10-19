import { makeCrudRoute, mentorCreateSchema } from "@devmentor/core";
import { withScope } from "../../../server/container";

export const dynamic = "force-dynamic";

export const { GET, POST } = makeCrudRoute({
  list: () => withScope(({ mentorService }) => mentorService.list()),
  create: {
    schema: mentorCreateSchema,
    run: (input) => withScope(({ mentorService }) => mentorService.register(input)),
  },
});
