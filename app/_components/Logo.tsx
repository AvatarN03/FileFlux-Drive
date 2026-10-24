import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  classes?: string;
  imageSrc?: string;
  imageAlt?: string;
  iconContainerClass?: string;
  textClass?: string;
}

const Logo = ({
  classes = "",
  imageSrc = "/logo-cabinet.svg",
  imageAlt = "FileFlux Logo",
  iconContainerClass,
  textClass,
}: LogoProps) => {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-95 ${classes}`}
    >
      <div
        className={
          iconContainerClass ||
          "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg overflow-hidden border border-brand-peach/40 shadow-[2px_2px_0px_0px_#FFA552] shrink-0 bg-brand-cream flex items-center justify-center p-0.5 transition-transform group-hover:scale-105"
        }
      >
        <Image
          src={imageSrc}
          width={36}
          height={36}
          alt={imageAlt}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <span
        className={`font-display tracking-tight select-none ${textClass || "text-lg sm:text-xl md:text-2xl"
          }`}
      >
        <span className="font-semibold text-brand-cream">File</span>
        <span className="font-extrabold text-brand-peach-vibrant ml-0.5">Flux</span>
      </span>
    </Link>
  );
};

export default Logo;
