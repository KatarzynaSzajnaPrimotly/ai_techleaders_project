import { makeCrudRoute } from "@devmentor/core";
import { withScope } from "../../../../server/container";
import { resolveCurrentSession } from "../../../../server/current-session";

export const dynamic = "force-dynamic";

export const { GET } = makeCrudRoute({
  access: { roles: ["operator"] },
  resolveCurrentSession,
  list: () => withScope(({ mentorService }) => mentorService.listPublishedProfiles()),
});
