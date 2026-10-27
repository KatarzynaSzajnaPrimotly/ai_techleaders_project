import { guardedPage } from "../../../server/guards";
import { withScope } from "../../../server/container";
import { MenteeHomeView } from "./home-view";

const MenteePage = guardedPage({ path: "/home", access: { roles: ["mentee"] } }, async (_props: Record<string, never>, session) => {
  const profile = await withScope(({ accountService }) => accountService.findForRoleHome(session.userId));
  const name = profile?.displayName?.trim() || profile?.githubLogin?.trim() || "You";
  return <MenteeHomeView name={name} session={session} />;
});

export default MenteePage;
