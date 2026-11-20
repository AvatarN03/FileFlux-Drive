import Link from "next/link";

import type { LucideIcon } from "lucide-react";

type EmptyStateLink = {
  label: string;
  href: string;
};

export const IsEmpty = ({
  text,
  href,
  link,
  links,
  Icon,
}: {
  text: string;
  link?: string;
  href?: string;
  links?: EmptyStateLink[];
  Icon: LucideIcon;
}) => {
  const navigationLinks = links ?? (link && href ? [{ label: link, href }] : []);

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-brand-border bg-brand-cream-muted px-6 py-12 text-center shadow-brown-3">
      <div className="flex h-12 w-12 items-center justify-center border-2 border-brand-violet bg-brand-peach shadow-violet-2">
        <Icon className="h-6 w-6 text-brand-violet" strokeWidth={2} />
      </div>
      <p className="text-sm font-bold text-brand-violet">{text}</p>
      {navigationLinks.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {navigationLinks.map(({ label, href: linkHref }) => (
            <Link
              key={linkHref}
              href={linkHref}
              className="border-2 border-brand-brown bg-brand-brown px-4 py-2 text-xs font-bold text-brand-cream shadow-violet-2 transition-all hover:-translate-y-px hover:bg-brand-brown-dark"
            >
              {label} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
