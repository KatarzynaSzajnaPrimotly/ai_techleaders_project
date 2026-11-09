import { guardedPage } from "../../../server/guards";
import { withScope } from "../../../server/container";
import { MentorHomeView } from "./mentor-view";

const MentorPage = guardedPage({ path: "/mentor", access: { roles: ["mentor"] } }, async (_props: Record<string, never>, session) => {
  const profile = await withScope(({ accountService }) => accountService.findForRoleHome(session.userId));
  const onboarding = await withScope(({ invitationService }) => invitationService.onboardingStatus(session.userId));
  const name = profile?.displayName?.trim() || profile?.githubLogin?.trim() || "You";
  return <MentorHomeView name={name} session={session} initialPublishDueAt={onboarding.initialPublishDueAt} />;
});

export default MentorPage;
