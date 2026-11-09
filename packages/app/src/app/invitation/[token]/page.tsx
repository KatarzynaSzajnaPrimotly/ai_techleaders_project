import { NotFoundError } from "@devmentor/core";
import { withScope } from "../../../server/container";
import { readSession } from "../../../server/guards";
import { InvitationView } from "./invitation-view";

export const dynamic = "force-dynamic";

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let invitation = null;
  try {
    invitation = await withScope(({ invitationService }) => invitationService.lookup(token));
  } catch (error) {
    if (!(error instanceof NotFoundError)) throw error;
  }
  const session = await readSession();
  const account = session
    ? await withScope(async ({ userRepository }) => {
      const user = await userRepository.findById(session.userId);
      return user ? { email: user.email, displayName: user.displayName, verified: user.emailVerifiedAt !== null } : null;
    })
    : null;
  return <InvitationView token={token} invitation={invitation} account={account} />;
}
