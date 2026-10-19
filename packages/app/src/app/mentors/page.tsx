import type { Metadata } from "next";
import { MentorCard } from "@devmentor/ui";
import { createRequestScope } from "../../server/container";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mentors | DevMentor" };

export default async function MentorsPage() {
  const { cradle } = await createRequestScope();
  const mentors = await cradle.mentorService.list();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">DevMentor</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Meet our mentors</h1>
        <p className="mt-3 text-muted-foreground">Experienced developers ready to help you grow.</p>
      </header>
      {mentors.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-muted-foreground">
          No mentors have joined yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              name={mentor.name}
              email={mentor.email}
              joinedAt={mentor.createdAt.toISOString().slice(0, 10)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
