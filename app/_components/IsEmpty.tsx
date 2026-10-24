import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export const IsEmpty = ({
  text,
  href,
  link,
  Icon,
}: {
  text: string;
  link?: string;
  href?: string;
  Icon: LucideIcon;
}) => {
  return (
    <div className="flex flex-col items-center gap-3 py-12 px-6 text-center justify-center bg-brand-cream-muted border-2 border-brand-border shadow-[3px_3px_0px_0px_#BA5624]">
      <div className="flex h-12 w-12 items-center justify-center bg-brand-peach border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A]">
        <Icon className="h-6 w-6 text-brand-violet" strokeWidth={2} />
      </div>
      <p className="text-sm font-bold text-brand-violet">{text}</p>
      {link &&
        (href ? (
          <Link
            href={href}
            className="mt-1 px-4 py-2 text-xs font-bold bg-brand-brown hover:bg-brand-brown-dark text-brand-cream border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
          >
            {link} →
          </Link>
        ) : (
          <p className="mt-1 px-4 py-2 text-xs font-bold bg-brand-brown text-brand-cream border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]">
            {link} →
          </p>
        ))}
    </div>
  );
};
