"use client";

import { motion } from "motion/react";
import { HERO_CAPABILITY_CARDS, HERO_VAULT_FILES } from "@/constant";
import {
  ShieldCheck,
  HardDrive,
  FolderTree,
  Lock,
  Search,
  Plus,
  Zap,
  LockKeyhole,
  X,
  Minus,
  Square,
} from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden border-b-2 border-brand-border pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Split Grid: 7 Cols (Story & Action) + 5 Cols (Live Vault Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
          
          {/* Left Column: Command & Narrative Hub */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Live Security Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border-l-4 border-y border-r border-brand-violet-dark bg-brand-violet text-brand-peach text-xs font-bold uppercase tracking-wider mb-6 shadow-brown-3 rounded-none">
              <span className="w-2 h-2 bg-brand-peach-vibrant inline-block animate-pulse" />
              <span>Encrypted Personal File Vault</span>
            </div>

            {/* Main Headline with Distinct Font Contrast */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-brand-violet tracking-tight leading-[1.08] mb-6">
              Your Files, Encrypted{" "}
              <span className="text-brand-brown block mt-1">
                Before They Leave Your Device.
              </span>
              <div className="mt-3">
                <span className="inline-block bg-brand-violet text-brand-peach border-2 border-brand-violet-dark px-3.5 py-1 text-xl sm:text-2xl lg:text-3xl font-extrabold shadow-peach-vibrant-4 rounded-none">
                  100% Zero-Knowledge
                </span>
              </div>
            </h1>

            {/* Subheading / Value Statement */}
            <p className="text-sm sm:text-base lg:text-lg text-brand-violet/85 max-w-2xl mb-8 font-medium leading-relaxed">
              FileFlux encrypts every file in your browser with your personal
              vault passphrase before anything is uploaded. Instant image and
              video previews, organized folders, and a clear view of your
              storage — no tracking, no plaintext on our servers.
            </p>

            {/* Micro-Trust Signals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-brand-border/80 w-full">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet">
                <ShieldCheck className="w-4 h-4 text-brand-brown shrink-0" />
                <span>Encrypted in your browser</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet">
                <Zap className="w-4 h-4 text-brand-peach-vibrant shrink-0" />
                <span>Image & Video Previews</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet sm:col-span-1">
                <LockKeyhole className="w-4 h-4 text-brand-violet shrink-0" />
                <span>Keys Never Leave Your Device</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive Vault Application Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="hidden sm:block lg:col-span-5 w-full"
          >
            <div className="border-2 border-brand-violet bg-brand-cream shadow-brown-responsive rounded-none overflow-hidden">
              
              {/* Window Header Bar */}
              <div className="flex items-center justify-between bg-brand-violet px-4 py-3 border-b-2 border-brand-brown text-xs text-brand-cream">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-peach-vibrant text-brand-violet-dark flex items-center justify-center" aria-hidden="true">
                    <X className="w-2.5 h-2.5" />
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-brown text-brand-cream flex items-center justify-center" aria-hidden="true">
                    <Minus className="w-2.5 h-2.5" />
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-peach text-brand-violet flex items-center justify-center" aria-hidden="true">
                    <Square className="w-2 h-2" />
                  </span>
                  <span className="ml-2 font-mono text-[11px] text-brand-peach font-bold truncate">FileFlux</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-brand-brown text-brand-cream px-2 py-0.5 text-[10px] font-mono font-bold border border-brand-peach-vibrant/40">
                    <HardDrive className="w-3 h-3" />
                    18.2 MB / 50 MB
                  </span>
                </div>
              </div>

              {/* Workspace Action Toolbar */}
              <div className="bg-brand-cream-muted border-b border-brand-border px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-brown text-brand-cream px-2.5 py-1 text-xs font-bold border border-brand-brown-dark shadow-violet-1 inline-flex items-center gap-1.5">
                    <Plus className="w-3 h-3" /> Upload
                  </span>
                  <span className="bg-brand-peach text-brand-violet px-2.5 py-1 text-xs font-bold border border-brand-border inline-flex items-center gap-1.5">
                    <FolderTree className="w-3 h-3" /> New Folder
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-cream border border-brand-border px-2.5 py-1 text-xs text-brand-violet">
                  <Search className="w-3 h-3 text-brand-brown" />
                  <span className="text-brand-violet/50 font-mono text-[10px]">Filter...</span>
                </div>
              </div>

              {/* File List Rows with Visual Variety */}
              <div className="p-3.5 flex flex-col gap-2 bg-brand-cream">
                <div className="grid grid-cols-12 text-[10px] font-bold text-brand-violet bg-brand-cream-muted border-y border-brand-border py-1.5 px-2.5 uppercase tracking-wider">
                  <span className="col-span-6">Resource Name</span>
                  <span className="col-span-3">Status</span>
                  <span className="col-span-3 text-right">Size</span>
                </div>

                {HERO_VAULT_FILES.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-12 items-center text-xs p-2 bg-brand-cream-muted/50 border border-brand-border hover:border-brand-brown hover:bg-brand-cream transition-colors text-brand-violet"
                  >
                    <div className="col-span-6 flex items-center gap-2 truncate font-semibold">
                      <item.icon className={`w-3.5 h-3.5 ${item.iconColor} shrink-0`} />
                      <span className="truncate text-xs">{item.name}</span>
                    </div>
                    <div className="col-span-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[9px] font-bold border ${item.badgeClass}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <div className="col-span-3 text-right text-brand-violet/80 font-mono text-[10px]">
                      {item.size}
                    </div>
                  </div>
                ))}

                {/* Live Vault Encryption Status Widget Inside Preview */}
                <div className="mt-2 p-3 bg-brand-violet-dark text-brand-cream border-2 border-brand-violet flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-brand-brown border border-brand-peach flex items-center justify-center text-brand-cream shrink-0">
                      <Lock className="w-3.5 h-3.5 text-brand-peach" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-brand-cream">Personal Vault Active</div>
                      <div className="text-[9px] text-brand-peach/80 font-mono">Argon2id Key Derivation</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-brand-peach-vibrant text-brand-violet-dark px-2 py-0.5 text-[10px] font-bold">
                      E2E Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom 3 Capability Cards: Expanded Across max-w-[1400px] */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
        >
          {HERO_CAPABILITY_CARDS.map((card) => (
            <div
              key={card.title}
              className={`${card.cardClass} rounded-none flex items-start gap-3.5 hover:translate-x-px hover:translate-y-px transition-all`}
            >
              <div className={`w-10 h-10 flex items-center justify-center shrink-0 rounded-none ${card.iconClass}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-violet">
                  {card.title}
                </h3>
                <p className="text-xs text-brand-violet/80 mt-1 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
