"use client";

import { useRef, useState } from "react";

/** Reveal window width as a fraction of the wordmark's own width (~1 letter). */
const WINDOW_WIDTH_RATIO = 0.11;

const FooterWordmark = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  /** Left edge of the reveal window in % of container width; null = hidden. */
  const [windowLeftPercent, setWindowLeftPercent] = useState<number | null>(
    null,
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;

    const windowWidthPercent = WINDOW_WIDTH_RATIO * 100;
    const rawLeft =
      ((event.clientX - rect.left - (rect.width * WINDOW_WIDTH_RATIO) / 2) /
        rect.width) *
      100;
    const clampedLeft = Math.min(
      Math.max(rawLeft, 0),
      100 - windowWidthPercent,
    );

    setWindowLeftPercent(clampedLeft);
  };

  const handleMouseLeave = () => setWindowLeftPercent(null);

  const revealStyle = {
    clipPath:
      windowLeftPercent === null
        ? "inset(0 100% 0 100%)"
        : `inset(0 ${
            100 - windowLeftPercent - WINDOW_WIDTH_RATIO * 100
          }% 0 ${windowLeftPercent}%)`,
  };

  return (
    <div
      aria-hidden="true"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative select-none overflow-hidden pb-[1vw]"
    >
      {/* Base outlined wordmark (resting look, unchanged) */}
      <div className="w-full text-center font-extrabold uppercase whitespace-nowrap text-transparent opacity-30 [-webkit-text-stroke:2px_#FFA552] text-[18vw] leading-[0.78] tracking-tight">
        FILEFLUX
      </div>

      {/* Peach-filled copy revealed only through the cursor-following window,
          so the letters themselves light up with no visible rectangle */}
      <div
        className="absolute inset-0 w-full text-center font-extrabold uppercase whitespace-nowrap text-brand-peach-vibrant text-[18vw] leading-[0.78] tracking-tight transition-[clip-path] duration-200 ease-out"
        style={revealStyle}
      >
        FILEFLUX
      </div>
    </div>
  );
};

export default FooterWordmark;
