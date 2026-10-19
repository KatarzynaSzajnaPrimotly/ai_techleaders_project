import type { Metadata } from "next";
import { FEATURED_TUTORS, SUBJECTS } from "@devmentor/core";
import { SearchBar, SiteFooter, SiteHeader, TutorCard } from "@devmentor/ui";

export const metadata: Metadata = {
  title: "DevMentor — Learn anything, from real people",
  description: "1-on-1 online lessons in languages, programming, music and more.",
};

const BRAND = "DevMentor";
const TUTORS_PATH = "/mentors";

const STATS = [
  { value: "900+", label: "Verified tutors" },
  { value: "4.8/5", label: "Average rating" },
  { value: "40k+", label: "Lessons delivered" },
];

const STEPS = [
  { title: "Find a tutor", text: "Search by subject, price, availability and reviews." },
  { title: "Book a trial lesson", text: "Try a tutor risk-free before committing to a package." },
  { title: "Learn at your pace", text: "Message, schedule and track your progress in one place." },
];

const containerClass = "mx-auto max-w-[1160px] px-6";

export default function Home() {
  return (
    <div className="min-h-screen bg-mentora-bg leading-normal text-mentora-ink">
      <SiteHeader brand={BRAND} homeHref="/" links={[{ label: "Find a tutor", href: TUTORS_PATH }]} />

      <main>
        <section className="bg-linear-to-b from-mentora-light to-transparent py-12">
          <div className={containerClass}>
            <h1 className="m-0 max-w-[720px] text-4xl font-extrabold tracking-tight sm:text-[40px]">
              Find the perfect tutor and start learning today
            </h1>
            <p className="m-0 mt-3 max-w-[580px] text-[17px] text-mentora-muted">
              1‑on‑1 online lessons in languages, programming, music and more. Book a low‑cost trial lesson with no
              long-term commitment.
            </p>
            <div className="mt-6 max-w-[560px]">
              <SearchBar
                action={TUTORS_PATH}
                name="subject"
                label="What do you want to learn?"
                placeholder="What do you want to learn? e.g. Spanish, React, Guitar"
                suggestions={SUBJECTS}
              />
            </div>
            <ul aria-label="Subjects" className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
              {SUBJECTS.map((subject) => (
                <li key={subject}>
                  <a
                    href={`${TUTORS_PATH}?subject=${encodeURIComponent(subject)}`}
                    className="inline-block rounded-full border border-mentora-line bg-white px-3.5 py-2 text-[13px] font-semibold text-mentora-ink no-underline hover:border-mentora hover:bg-mentora-light hover:text-mentora"
                  >
                    {subject}
                  </a>
                </li>
              ))}
            </ul>
            <ul aria-label="Platform stats" className="m-0 mt-8 flex list-none flex-wrap gap-8 p-0">
              {STATS.map((stat) => (
                <li key={stat.label}>
                  <span className="block text-[28px] font-extrabold text-mentora">{stat.value}</span>
                  <span className="block text-[13px] text-mentora-muted">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12" aria-labelledby="featured-heading">
          <div className={containerClass}>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 id="featured-heading" className="m-0 text-2xl font-extrabold">
                Featured tutors
              </h2>
              <a href={TUTORS_PATH} className="font-semibold text-mentora no-underline">
                See all →
              </a>
            </div>
            <ul className="m-0 grid list-none auto-cols-[280px] grid-flow-col gap-4 overflow-x-auto p-0 pb-2">
              {FEATURED_TUTORS.map((tutor) => (
                <TutorCard key={tutor.id} {...tutor} />
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white py-12" aria-labelledby="how-heading">
          <div className={containerClass}>
            <h2 id="how-heading" className="m-0 mb-6 text-2xl font-extrabold">
              How it works
            </h2>
            <ol className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-mentora-line bg-white p-6">
                  <div
                    aria-hidden="true"
                    className="mb-3 flex size-8 items-center justify-center rounded-full bg-mentora font-extrabold text-white"
                  >
                    {index + 1}
                  </div>
                  <h3 className="m-0 text-[17px] font-bold">{step.title}</h3>
                  <p className="m-0 mt-2 text-[13px] text-mentora-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <SiteFooter note="© 2026 DevMentor" links={[{ label: "Tutors", href: TUTORS_PATH }]} />
    </div>
  );
}
