"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  HardDrive,
  FolderTree,
  FileText,
  Lock,
  Sparkles,
  Search,
  Plus,
  Zap,
  FileCode,
  LockKeyhole,
} from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-gradient-to-b from-brand-cream via-brand-cream-muted to-brand-cream border-b-2 border-brand-border pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      {/* Network Topology Background Overlay */}
      <div className="absolute inset-0 bg-pattern-network opacity-50 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Split Grid: 7 Cols (Story & Action) + 5 Cols (Live Vault Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
          
          {/* Left Column: Command & Narrative Hub */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Live Security Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border-l-4 border-brand-peach-vibrant border-y border-r border-brand-violet-dark bg-brand-violet text-brand-peach text-xs font-bold uppercase tracking-wider mb-6 shadow-[3px_3px_0px_0px_#BA5624] rounded-none"
            >
              <span className="w-2 h-2 bg-brand-peach-vibrant inline-block animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-brand-peach-vibrant" />
              <span>Next-Gen Encrypted File Platform</span>
            </motion.div>

            {/* Main Headline with Distinct Font Contrast */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-brand-violet tracking-tight leading-[1.08] mb-6"
            >
              Upload, Encrypt & Command Your Files{" "}
              <span className="text-brand-brown block mt-1">
                With Absolute Confidence.
              </span>
              <div className="mt-3">
                <span className="inline-block bg-brand-violet text-brand-peach border-2 border-brand-violet-dark px-3.5 py-1 text-xl sm:text-2xl lg:text-3xl font-extrabold shadow-[4px_4px_0px_0px_#FFA552] rounded-none">
                  100% Zero-Knowledge
                </span>
              </div>
            </motion.h1>

            {/* Subheading / Value Statement */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-brand-violet/85 max-w-2xl mb-8 font-medium leading-relaxed"
            >
              Engineered with client-side libsodium cryptographic vaults, instant
              lossless file previews, granular public sharing controls, and real-time
              quota telemetry. Zero tracking. Zero unencrypted storage.
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8"
            >
              <Link
                href="/auth?continueTo=dashboard"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-sm sm:text-base border-2 border-brand-brown shadow-[4px_4px_0px_0px_#381D2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#381D2A] transition-all rounded-none"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 text-brand-peach" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-cream hover:bg-brand-cream-muted text-brand-violet hover:text-brand-brown font-bold text-sm sm:text-base border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#BA5624] transition-all rounded-none"
              >
                Explore Features
              </Link>
            </motion.div>

            {/* Micro-Trust Signals Grid */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-brand-border/80 w-full"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet">
                <ShieldCheck className="w-4 h-4 text-brand-brown shrink-0" />
                <span>Client-Side AES & libsodium</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet">
                <Zap className="w-4 h-4 text-brand-peach-vibrant shrink-0" />
                <span>Instant In-Browser Previews</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet col-span-2 sm:col-span-1">
                <LockKeyhole className="w-4 h-4 text-brand-violet shrink-0" />
                <span>Zero Server Telemetry</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Live Interactive Vault Application Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 w-full"
          >
            <div className="border-2 border-brand-violet bg-brand-cream shadow-[8px_8px_0px_0px_#BA5624] sm:shadow-[12px_12px_0px_0px_#BA5624] rounded-none overflow-hidden">
              
              {/* Window Header Bar */}
              <div className="flex items-center justify-between bg-brand-violet px-4 py-3 border-b-2 border-brand-brown text-xs text-brand-cream">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-brand-peach-vibrant inline-block" />
                  <span className="w-3 h-3 bg-brand-brown inline-block" />
                  <span className="w-3 h-3 bg-brand-peach inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-brand-peach font-bold truncate">
                    fileflux://vault/alpha
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-brand-brown text-brand-cream px-2 py-0.5 text-[10px] font-mono font-bold border border-brand-peach-vibrant/40">
                    <HardDrive className="w-3 h-3" />
                    24.5 MB / 500 MB
                  </span>
                </div>
              </div>

              {/* Workspace Action Toolbar */}
              <div className="bg-brand-cream-muted border-b border-brand-border px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-brown text-brand-cream px-2.5 py-1 text-xs font-bold border border-brand-brown-dark shadow-[1px_1px_0px_0px_#381D2A] inline-flex items-center gap-1.5">
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

                {[
                  {
                    name: "Financial-Audit-2026.pdf",
                    badge: "Verified",
                    badgeClass: "bg-brand-peach/60 text-brand-violet border-brand-border",
                    size: "3.2 MB",
                    icon: FileText,
                    iconColor: "text-brand-brown",
                  },
                  {
                    name: "Master-Keys.encrypted",
                    badge: "Vault Locked",
                    badgeClass: "bg-brand-violet text-brand-peach border-brand-peach-vibrant",
                    size: "640 KB",
                    icon: Lock,
                    iconColor: "text-brand-peach-vibrant",
                  },
                  {
                    name: "Brand-Tokens.json",
                    badge: "Public Link",
                    badgeClass: "bg-brand-peach-vibrant/20 text-brand-brown-dark border-brand-brown",
                    size: "24.8 KB",
                    icon: FileCode,
                    iconColor: "text-brand-brown",
                  },
                  {
                    name: "Telemetry-Archive.zip",
                    badge: "Cold Storage",
                    badgeClass: "bg-brand-cream-muted text-brand-violet/80 border-brand-border",
                    size: "18.5 MB",
                    icon: FileText,
                    iconColor: "text-brand-brown",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
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
                      <div className="text-[9px] text-brand-peach/80 font-mono">Argon2id Hash Key Derived</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-brand-peach-vibrant text-brand-violet-dark px-2 py-0.5 text-[10px] font-bold">
                      Zero-Knowledge
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
          className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 w-full"
        >
          {/* Card 1: Personal Vault */}
          <div className="bg-brand-cream border-2 border-brand-brown p-5 shadow-[4px_4px_0px_0px_#BA5624] rounded-none flex items-start gap-3.5 hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="w-10 h-10 bg-brand-peach/40 border-2 border-brand-brown flex items-center justify-center text-brand-brown shrink-0 rounded-none shadow-[2px_2px_0px_0px_#BA5624]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-violet">
                Personal Encrypted Vault
              </h3>
              <p className="text-xs text-brand-violet/80 mt-1 leading-relaxed">
                Client-side libsodium passphrase encryption ensuring private files remain unreadable to any server or host.
              </p>
            </div>
          </div>

          {/* Card 2: Lossless Previews */}
          <div className="bg-brand-cream border-2 border-brand-peach-vibrant p-5 shadow-[4px_4px_0px_0px_#FFA552] rounded-none flex items-start gap-3.5 hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="w-10 h-10 bg-brand-peach-vibrant/20 border-2 border-brand-peach-vibrant flex items-center justify-center text-brand-brown-dark shrink-0 rounded-none shadow-[2px_2px_0px_0px_#FFA552]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-violet">
                Lossless Instant Previews
              </h3>
              <p className="text-xs text-brand-violet/80 mt-1 leading-relaxed">
                Fast browser-side inspection for PDFs, images, JSON schemas, and code files with zero quality degradation.
              </p>
            </div>
          </div>

          {/* Card 3: Granular Sharing */}
          <div className="bg-brand-cream border-2 border-brand-violet p-5 shadow-[4px_4px_0px_0px_#381D2A] rounded-none flex items-start gap-3.5 hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="w-10 h-10 bg-brand-violet text-brand-peach border-2 border-brand-violet flex items-center justify-center shrink-0 rounded-none shadow-[2px_2px_0px_0px_#381D2A]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-violet">
                Granular Public Sharing
              </h3>
              <p className="text-xs text-brand-violet/80 mt-1 leading-relaxed">
                One-click link generation, customizable download rules, and real-time access telemetry for public assets.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
