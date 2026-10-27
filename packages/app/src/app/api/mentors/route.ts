import { makeCrudRoute, mentorCreateSchema } from "@devmentor/core";
import { withScope } from "../../../server/container";

export const dynamic = "force-dynamic";

export const { GET, POST } = makeCrudRoute({
  // E01-S03 replaces this public declaration with operator-only access.
  access: "public",
  list: () => withScope(({ mentorService }) => mentorService.list()),
  create: {
    schema: mentorCreateSchema,
    run: (input) => withScope(({ mentorService }) => mentorService.register(input)),
  },
});
