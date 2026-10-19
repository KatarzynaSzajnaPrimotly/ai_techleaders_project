export interface TutorCardProps {
  name: string;
  avatarEmoji: string;
  headline: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export function TutorCard({ name, avatarEmoji, headline, pricePerHour, rating, reviewCount, badge }: TutorCardProps) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-mentora-line bg-white shadow-sm">
      <div className="relative flex aspect-[16/10] items-center justify-center bg-mentora-light text-4xl">
        {badge ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-mentora-accent px-2 py-0.5 text-[11px] font-bold text-white">
            {badge}
          </span>
        ) : null}
        <span aria-hidden="true">{avatarEmoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="m-0 text-[15px] font-bold">{name}</h3>
        <p className="m-0 min-h-9 text-[13px] text-mentora-muted">{headline}</p>
        <p className="m-0 flex items-center gap-1.5 text-[13px] text-mentora-muted">
          <span className="font-bold text-mentora-warning">★ {rating.toFixed(1)}</span>
          <span>({reviewCount})</span>
        </p>
        <p className="m-0 mt-auto border-0 border-t border-dashed border-mentora-line pt-2 font-extrabold">
          ${pricePerHour}
          <small className="font-medium text-mentora-muted">/hr</small>
        </p>
      </div>
    </li>
  );
}
