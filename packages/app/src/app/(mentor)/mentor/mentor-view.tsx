import type { Session } from "@devmentor/core";
import { RoleShell } from "@devmentor/ui";
import { LocalTime } from "@devmentor/ui";

export function MentorHomeView({ name, session, initialPublishDueAt }: { name: string; session: Session; initialPublishDueAt: Date | null }) {
  return (
    <RoleShell name={name} role="mentor">
      <section className="rounded-2xl border border-mentora-line bg-mentora-bg p-6">
        <h1 className="m-0 text-2xl font-bold tracking-tight">Welcome</h1>
        <p className="mb-0 mt-2 text-sm text-mentora-muted">You are signed in as a {session.role}.</p>
      </section>
      <nav aria-label="Mentor tools" className="flex flex-wrap gap-4 text-sm">
        <a className="underline" href="/mentor/profile">Edit your mentor page</a>
        <a className="underline" href="/mentor/slots">Manage availability</a>
        <a className="underline" href="/mentor/prices">Set session prices</a>
      </nav>
      {initialPublishDueAt ? (
        <section className="mt-6 rounded-2xl border border-mentora-line bg-mentora-bg p-6">
          <h2 className="m-0 text-lg font-semibold">Your first milestone</h2>
          <p className="mb-0 mt-2 text-sm text-mentora-muted">Publish at least one bookable session by <LocalTime value={initialPublishDueAt} />.</p>
        </section>
      ) : null}
    </RoleShell>
  );
}
