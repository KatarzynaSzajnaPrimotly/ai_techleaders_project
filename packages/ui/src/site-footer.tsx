import type { NavLink } from "./site-header";

export interface SiteFooterProps {
  note: string;
  links: readonly NavLink[];
}

export function SiteFooter({ note, links }: SiteFooterProps) {
  return (
    <footer className="border-t border-mentora-line bg-white py-8">
      <div className="mx-auto flex max-w-[1160px] flex-wrap justify-between gap-6 px-6 text-[13px] text-mentora-muted">
        <p className="m-0">{note}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-inherit no-underline hover:text-mentora">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
