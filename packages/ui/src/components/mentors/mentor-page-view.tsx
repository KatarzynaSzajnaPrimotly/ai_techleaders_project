type MentorProfilePublicDto = { slug: string; displayName: string; publicWorkUrl: string; bio: string; stackTags: string[] };
export function MentorPageView({ profile }: { profile: MentorProfilePublicDto }) {
  return <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-12"><header><p className="text-sm text-muted-foreground">Mentor</p><h1 className="break-words text-4xl font-semibold">{profile.displayName}</h1></header><a className="underline" href={profile.publicWorkUrl} rel="noreferrer">Public work</a><p className="whitespace-pre-wrap">{profile.bio}</p><ul className="flex list-none flex-wrap gap-2">{profile.stackTags.map((tag) => <li className="rounded-full bg-muted px-3 py-1" key={tag}>{tag}</li>)}</ul></main>;
}
