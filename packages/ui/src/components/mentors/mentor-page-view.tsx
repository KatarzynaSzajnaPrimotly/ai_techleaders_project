import { LocalTime } from "../../frontend/time/LocalTime";

type MentorProfilePublicDto = { slug: string; displayName: string; publicWorkUrl: string; bio: string; stackTags: string[] };

interface PublicSlot { id: string; startsAt: Date | string; meetsLeadTime: boolean }

export function MentorPageView({ profile, slots = [] }: { profile: MentorProfilePublicDto; slots?: PublicSlot[] }) {
  return <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-12"><header><p className="text-sm text-muted-foreground">Mentor</p><h1 className="break-words text-4xl font-semibold">{profile.displayName}</h1></header><a className="underline" href={profile.publicWorkUrl} rel="noreferrer">Public work</a><p className="whitespace-pre-wrap">{profile.bio}</p><ul className="flex list-none flex-wrap gap-2">{profile.stackTags.map((tag) => <li className="rounded-full bg-muted px-3 py-1" key={tag}>{tag}</li>)}</ul><section aria-labelledby="availability-heading" className="space-y-3"><h2 id="availability-heading" className="text-xl font-semibold">Availability</h2>{slots.length ? <ul className="space-y-3">{slots.map((slot) => <li key={slot.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"><LocalTime value={slot.startsAt} />{slot.meetsLeadTime ? <span>Available</span> : <span aria-label="Unavailable: less than two hours' notice" className="text-muted-foreground">Unavailable — less than two hours’ notice</span>}</li>)}</ul> : <p className="text-sm text-muted-foreground">No upcoming times have been published.</p>}</section></main>;
}
