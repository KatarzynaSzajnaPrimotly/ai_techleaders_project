import type { Session } from "@devmentor/core";
import { RoleShell } from "@devmentor/ui";

export function MentorHomeView({ session }: { session: Session }) {
  return (
    <RoleShell name="You" role="mentor">
      <section className="rounded-2xl border border-mentora-line bg-mentora-bg p-6">
        <h1 className="m-0 text-2xl font-bold tracking-tight">Welcome</h1>
        <p className="mb-0 mt-2 text-sm text-mentora-muted">You are signed in as a {session.role}.</p>
      </section>
    </RoleShell>
  );
}
