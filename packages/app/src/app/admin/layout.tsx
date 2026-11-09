import type { ReactNode } from "react";
import { RoleShell } from "@devmentor/ui";
import { withScope } from "../../server/container";
import { readSession } from "../../server/guards";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await readSession();
  const profile = session
    ? await withScope(({ accountService }) => accountService.findForRoleHome(session.userId))
    : null;
  const name = profile?.displayName?.trim() || profile?.githubLogin?.trim() || "You";

  return <RoleShell name={name} role="operator" wide>{children}</RoleShell>;
}
