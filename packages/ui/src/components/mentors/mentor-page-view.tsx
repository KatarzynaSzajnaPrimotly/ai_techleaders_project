import { LocalTime } from "../../frontend/time/LocalTime";

type MentorProfilePublicDto = {
  slug: string;
  displayName: string;
  publicWorkUrl: string;
  bio: string;
  stackTags: string[];
  prices: { price25Cents: number | null; price50Cents: number | null; currency: string } | null;
  isBookable: boolean;
};

interface PublicSlot { id: string; startsAt: Date | string; meetsLeadTime: boolean }

function formatPrice(cents: number | null) {
  if (cents === null) return null;
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}

export function MentorPageView({ profile, slots = [] }: { profile: MentorProfilePublicDto; slots?: PublicSlot[] }) {
  const price25 = formatPrice(profile.prices?.price25Cents ?? null);
  const price50 = formatPrice(profile.prices?.price50Cents ?? null);

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <header>
        <p className="text-sm text-muted-foreground">Mentor</p>
        <h1 className="break-words text-4xl font-semibold">{profile.displayName}</h1>
      </header>
      <a className="underline" href={profile.publicWorkUrl} rel="noreferrer">Public work</a>
      <p className="whitespace-pre-wrap">{profile.bio}</p>
      <ul className="flex list-none flex-wrap gap-2">
        {profile.stackTags.map((tag) => <li className="rounded-full bg-muted px-3 py-1" key={tag}>{tag}</li>)}
      </ul>
      <section aria-labelledby="prices-heading" className="space-y-2">
        <h2 id="prices-heading" className="text-xl font-semibold">Session prices</h2>
        {profile.prices ? (
          <ul className="space-y-1">
            <li>25 minutes: {price25} {profile.prices.currency}</li>
            <li>50 minutes: {price50} {profile.prices.currency}</li>
          </ul>
        ) : <p className="text-sm text-muted-foreground">Prices have not been set yet.</p>}
        {!profile.isBookable ? <p role="status" className="text-sm text-muted-foreground">Not bookable yet.</p> : null}
      </section>
      <section aria-labelledby="availability-heading" className="space-y-3">
        <h2 id="availability-heading" className="text-xl font-semibold">Availability</h2>
        {slots.length ? (
          <ul className="space-y-3">
            {slots.map((slot) => (
              <li key={slot.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                <LocalTime value={slot.startsAt} />
                {!profile.isBookable ? <span>Not bookable yet</span> : slot.meetsLeadTime ? <span>Available</span> : (
                  <span aria-label="Unavailable: less than two hours' notice" className="text-muted-foreground">Unavailable — less than two hours’ notice</span>
                )}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No upcoming times have been published.</p>}
      </section>
    </main>
  );
}
