import { guardedPage } from "../../../server/guards";
import { withScope } from "../../../server/container";
import { MentorPriceEditor } from "./price-editor";

export const dynamic = "force-dynamic";

const MentorPricesPage = guardedPage<Record<string, never>>({ path: "/mentor/prices", access: { roles: ["mentor"] } }, async (_props, session) => {
  const initial = await withScope(({ mentorService }) => mentorService.priceConfiguration(session.userId));
  return <MentorPriceEditor initial={initial} />;
});

export default MentorPricesPage;
