import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mentors | DevMentor" };

export default function MentorsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">DevMentor</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Meet our mentors</h1>
        <p className="mt-3 text-muted-foreground">Experienced developers ready to help you grow.</p>
      </header>
      <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-muted-foreground">
        Mentors share their pages directly. Browseable mentor pages will be available soon.
      </p>
    </div>
  );
}
