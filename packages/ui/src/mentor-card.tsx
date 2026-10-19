export interface MentorCardProps {
  name: string;
  email: string;
  joinedAt: string;
}

export function MentorCard({ name, email, joinedAt }: MentorCardProps) {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{name}</p>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
        <p className="mt-1 text-xs text-muted-foreground">Joined {joinedAt}</p>
      </div>
    </li>
  );
}
