export interface NavLink {
  label: string;
  href: string;
}

export interface SiteHeaderProps {
  brand: string;
  homeHref: string;
  links: readonly NavLink[];
}

export function SiteHeader({ brand, homeHref, links }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-mentora-line bg-white">
      <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-6 px-6">
        <a href={homeHref} className="flex items-center gap-1.5 text-xl font-extrabold text-mentora no-underline">
          {brand}
          <span aria-hidden="true" className="size-2 rounded-full bg-mentora-accent" />
        </a>
        <nav aria-label="Main" className="hidden flex-1 items-center gap-4 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-1 py-2 text-sm font-semibold text-mentora-muted no-underline hover:text-mentora"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
