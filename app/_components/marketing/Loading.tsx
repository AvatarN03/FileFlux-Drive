"use client";

import Image from "next/image";

interface LoadingProps {
  statusText?: string;
  subText?: string;
}

const Loading = ({
  statusText = "INITIALIZING ENCRYPTED VAULT",
  subText = "Validating zero-knowledge keys & encrypted state...",
}: LoadingProps) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-brand-cream bg-pattern-network text-brand-violet selection:bg-brand-peach selection:text-brand-violet overflow-hidden">
      {/* Neo-Brutalist Technical Corner Decals */}
      <div className="absolute top-4 left-4 hidden md:flex items-center gap-2 font-mono text-[11px] font-bold text-brand-violet/70 border-2 border-brand-violet/20 px-2.5 py-1 bg-brand-cream/90 shadow-[2px_2px_0px_0px_rgba(56,29,42,0.15)] select-none">
        <span className="w-2 h-2 bg-brand-brown animate-pulse shrink-0"></span>
        <span>SYS://FILEFLUX/ENCRYPTED_VAULT</span>
      </div>

      <div className="absolute top-4 right-4 hidden md:flex items-center gap-2 font-mono text-[11px] font-bold text-brand-violet/70 border-2 border-brand-violet/20 px-2.5 py-1 bg-brand-cream/90 shadow-[2px_2px_0px_0px_rgba(56,29,42,0.15)] select-none">
        <span>SECURITY: ZERO-KNOWLEDGE</span>
      </div>

      <div className="absolute bottom-4 left-4 hidden md:flex items-center gap-2 font-mono text-[11px] font-bold text-brand-violet/70 border-2 border-brand-violet/20 px-2.5 py-1 bg-brand-cream/90 shadow-[2px_2px_0px_0px_rgba(56,29,42,0.15)] select-none">
        <span>PROTOCOL: CLIENT_SIDE_AES_GCM</span>
      </div>

      <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 font-mono text-[11px] font-bold text-brand-violet/70 border-2 border-brand-violet/20 px-2.5 py-1 bg-brand-cream/90 shadow-[2px_2px_0px_0px_rgba(56,29,42,0.15)] select-none">
        <span>STATUS: BOOTSTRAPPING</span>
      </div>

      {/* Main Neo-Brutalist Loading Window */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-brand-cream border-2 border-brand-violet shadow-[6px_6px_0px_0px_#381D2A] transition-all">
        {/* Retro Window Header Strip */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-brand-violet text-brand-cream border-b-2 border-brand-violet select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand-peach border border-brand-violet-dark"></span>
            <span className="w-2.5 h-2.5 bg-brand-peach-vibrant border border-brand-violet-dark"></span>
            <span className="w-2.5 h-2.5 bg-brand-brown border border-brand-violet-dark"></span>
          </div>
          <span className="font-mono text-[11px] font-extrabold tracking-widest uppercase text-brand-peach">
            SYSTEM BOOT · FILEFLUX
          </span>
          <span className="font-mono text-[10px] text-brand-cream/60">v1.0</span>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Logo Cabinet Emblem with Neo-Brutalist Hard Shadow */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#FFA552] flex items-center justify-center p-2 mb-4 shrink-0 transition-transform hover:scale-105">
            <Image
              src="/logo-cabinet.svg"
              alt="FileFlux Cabinet Logo"
              width={80}
              height={80}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Wordmark */}
          <div className="flex items-center justify-center text-2xl sm:text-3xl tracking-tight select-none">
            <span className="font-extrabold text-brand-violet">File</span>
            <span className="font-black text-brand-peach-vibrant ml-1">Flux</span>
          </div>
          <p className="font-mono text-[11px] sm:text-xs font-bold text-brand-brown uppercase tracking-wider mt-1">
            Zero-Knowledge Personal Storage
          </p>

          {/* Neo-Brutalist Animated Hazard / Diagonal Striped Loading Bar */}
          <div className="w-full mt-6">
            <div className="w-full h-4 sm:h-5 bg-brand-cream-muted border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] p-0.5 overflow-hidden">
              <div className="w-full h-full animate-brutalist-stripes border border-brand-violet/20" />
            </div>
          </div>

          {/* Monospace Terminal Status Ticker */}
          <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-brand-violet">
            <span className="inline-block w-2 h-2 rounded-none bg-brand-peach-vibrant border border-brand-violet animate-ping" />
            <span className="tracking-wide uppercase">
              [ {statusText} ]
            </span>
          </div>
          <p className="font-mono text-[11px] text-brand-violet/70 mt-1.5 px-2">
            {subText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
