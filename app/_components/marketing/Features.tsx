"use client";

import { motion } from "motion/react";
import {
  ShieldCheck,
  HardDrive,
  FolderTree,
  FileText,
  Lock,
  Eye,
  Zap,
  Sparkles,
  ArrowUpRight,
  Share2,
  FileCode,
  Layers,
} from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full py-20 lg:py-28 bg-brand-cream border-b-2 border-brand-border overflow-hidden"
    >
      {/* Network Topology Background Pattern Overlay */}
      <div className="absolute inset-0 bg-pattern-network opacity-50 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-l-4 border-brand-peach-vibrant border-y border-r border-brand-violet-dark bg-brand-violet text-brand-peach text-xs font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_0px_#BA5624] rounded-none">
            <Sparkles className="w-3.5 h-3.5 text-brand-peach-vibrant" />
            <span>Architecture & Engine Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-violet tracking-tight mb-4">
            Everything You Need to Command Your Files
          </h2>
          <p className="text-base sm:text-lg text-brand-violet/85 leading-relaxed">
            Crafted for speed, zero-knowledge privacy, and total operational
            clarity. Explore the architectural modules driving the FileFlux platform.
          </p>
        </div>

        {/* Bento Grid: 12-Column Asymmetrical Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Bento Item 1: Flagship Personal Vault (Col-span 12 lg:col-span-8) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-8 bg-brand-cream-muted border-2 border-brand-brown p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_0px_#BA5624] hover:shadow-[4px_4px_0px_0px_#BA5624] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-none group"
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-brown text-brand-cream border-2 border-brand-brown-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#381D2A] rounded-none">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-brown">
                      Core Cryptographic Engine
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-violet group-hover:text-brand-brown transition-colors">
                      Zero-Knowledge Personal Vault
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-brand-violet text-brand-peach border border-brand-violet-dark">
                  libsodium + Argon2id
                </span>
              </div>

              <p className="text-sm sm:text-base text-brand-violet/85 leading-relaxed mb-6 max-w-2xl">
                Every sensitive document undergoes client-side encryption in your browser before transmission.
                Your private master passphrase never touches any remote database or server memory.
              </p>

              {/* Interactive Cryptographic Pipeline Visualizer */}
              <div className="bg-brand-violet-dark p-4 border-2 border-brand-violet text-brand-cream mb-2">
                <div className="text-[11px] font-mono text-brand-peach-vibrant font-bold mb-3 flex items-center justify-between">
                  <span>// CLIENT ENCRYPTION PIPELINE</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HARDWARE ACCELERATED
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-brand-violet/80 p-3 border border-brand-violet-light">
                    <div className="text-brand-peach/80 text-[10px] uppercase font-bold">1. Plaintext File</div>
                    <div className="font-mono font-bold text-brand-cream truncate mt-1">master_keys.env</div>
                    <div className="text-[10px] text-brand-cream/60 mt-0.5">Raw binary memory</div>
                  </div>
                  <div className="bg-brand-brown/40 p-3 border border-brand-brown flex flex-col justify-between">
                    <div>
                      <div className="text-brand-peach-vibrant text-[10px] uppercase font-bold">2. Salt & Derivation</div>
                      <div className="font-mono text-brand-cream truncate mt-1">Argon2id (m=64M, t=3)</div>
                    </div>
                    <div className="text-[10px] text-brand-peach mt-0.5">256-bit entropy</div>
                  </div>
                  <div className="bg-brand-violet/90 p-3 border border-brand-peach-vibrant/60">
                    <div className="text-brand-peach-vibrant text-[10px] uppercase font-bold">3. Encrypted Payload</div>
                    <div className="font-mono text-brand-peach text-[11px] truncate mt-1">0x7f9a2e...88bc</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Safe for cloud storage</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-semibold text-brand-violet/75">
              <span>Full cryptographic protection included with every account</span>
              <span className="inline-flex items-center gap-1 text-brand-brown font-bold group-hover:translate-x-1 transition-transform">
                Read Security Spec <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>

          {/* Bento Item 2: Live Telemetry & Quota Guard (Col-span 12 lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 lg:col-span-4 bg-brand-cream-muted border-2 border-brand-violet p-6 sm:p-7 flex flex-col justify-between shadow-[6px_6px_0px_0px_#381D2A] hover:shadow-[4px_4px_0px_0px_#381D2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-none group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-brand-violet text-brand-peach border-2 border-brand-violet-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#BA5624] rounded-none">
                  <HardDrive className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-brand-peach text-brand-violet border border-brand-border">
                  LIVE TELEMETRY
                </span>
              </div>

              <h3 className="text-xl font-bold text-brand-violet mb-2 group-hover:text-brand-brown transition-colors">
                Storage & Quota Telemetry
              </h3>
              <p className="text-sm text-brand-violet/85 leading-relaxed mb-6">
                Sub-millisecond capacity metrics tracking byte usage, folder distribution, and allocation quotas.
              </p>

              {/* Visual Telemetry Gauge */}
              <div className="p-4 bg-brand-cream border-2 border-brand-border space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-brand-violet">Vault Allocation</span>
                  <span className="font-mono text-xs font-bold text-brand-brown">24.5 MB / 500 MB</span>
                </div>
                <div className="w-full h-3 bg-brand-cream-muted border border-brand-border flex overflow-hidden">
                  <div className="bg-brand-brown h-full w-[50%]" title="Docs: 12.4 MB" />
                  <div className="bg-brand-violet h-full w-[33%]" title="Vault: 8.1 MB" />
                  <div className="bg-brand-peach-vibrant h-full w-[17%]" title="Media: 4.0 MB" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono text-brand-violet/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 bg-brand-brown inline-block shrink-0" />
                    <span>Docs (50%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 bg-brand-violet inline-block shrink-0" />
                    <span>Vault (33%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 bg-brand-peach-vibrant inline-block shrink-0" />
                    <span>Media (17%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-violet">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                Real-time sync active
              </span>
              <span className="font-mono text-brand-brown">0ms lag</span>
            </div>
          </motion.div>

          {/* Bento Item 3: Lossless Previews (Col-span 12 md:col-span-6 lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="col-span-12 md:col-span-6 lg:col-span-4 bg-brand-cream-muted border-2 border-brand-peach-vibrant p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#FFA552] hover:shadow-[4px_4px_0px_0px_#FFA552] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-none group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-brand-peach-vibrant text-brand-brown-dark border-2 border-brand-brown flex items-center justify-center shadow-[2px_2px_0px_0px_#381D2A] rounded-none">
                  <Eye className="w-5 h-5 text-brand-violet" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-peach-vibrant/20 text-brand-brown-dark border border-brand-peach-vibrant">
                  &lt; 80MS LATENCY
                </span>
              </div>

              <h3 className="text-xl font-bold text-brand-violet mb-2 group-hover:text-brand-brown transition-colors">
                Instant Lossless Previews
              </h3>
              <p className="text-sm text-brand-violet/85 leading-relaxed mb-5">
                Native in-browser inspection for PDFs, high-res images, spreadsheets, JSON schemas, and code files.
              </p>

              {/* Supported Format Dock */}
              <div className="grid grid-cols-3 gap-2 bg-brand-cream border-2 border-brand-border p-3 text-center">
                <div className="p-2 bg-brand-cream-muted border border-brand-border">
                  <div className="font-mono font-bold text-xs text-brand-brown">.PDF</div>
                  <div className="text-[9px] text-brand-violet/70">Lossless vector</div>
                </div>
                <div className="p-2 bg-brand-cream-muted border border-brand-border">
                  <div className="font-mono font-bold text-xs text-brand-violet">.JSON</div>
                  <div className="text-[9px] text-brand-violet/70">Syntax colored</div>
                </div>
                <div className="p-2 bg-brand-cream-muted border border-brand-border">
                  <div className="font-mono font-bold text-xs text-brand-brown-dark">.PNG/.SVG</div>
                  <div className="text-[9px] text-brand-violet/70">Raw fidelity</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-semibold text-brand-violet/80">
              <span>Zero local conversion lag</span>
              <Zap className="w-4 h-4 text-brand-peach-vibrant" />
            </div>
          </motion.div>

          {/* Bento Item 4: Granular Public & Private Sharing (Col-span 12 md:col-span-6 lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 md:col-span-6 lg:col-span-4 bg-brand-cream-muted border-2 border-brand-violet p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#BA5624] hover:shadow-[4px_4px_0px_0px_#BA5624] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-none group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-brand-violet text-brand-peach border-2 border-brand-violet-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#FFA552] rounded-none">
                  <Share2 className="w-5 h-5 text-brand-peach" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-cream text-brand-violet border border-brand-border">
                  TOKEN ACCESS
                </span>
              </div>

              <h3 className="text-xl font-bold text-brand-violet mb-2 group-hover:text-brand-brown transition-colors">
                Granular Access & Sharing
              </h3>
              <p className="text-sm text-brand-violet/85 leading-relaxed mb-5">
                Generate expiring public access tokens, or enforce strict personal vault privacy with one click.
              </p>

              {/* Share Config Simulation Panel */}
              <div className="bg-brand-cream border-2 border-brand-border p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-violet">Public Access Token</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    ENABLED
                  </span>
                </div>
                <div className="p-2 bg-brand-violet-dark text-brand-peach font-mono text-[11px] truncate border border-brand-violet">
                  https://fileflux.app/share/v92x...
                </div>
                <div className="flex items-center justify-between text-[10px] text-brand-violet/75">
                  <span>Auto-destruct: 24 hours</span>
                  <span className="font-bold text-brand-brown">Passphrase Locked</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-semibold text-brand-violet/80">
              <span>Instant permission revocation</span>
              <Lock className="w-3.5 h-3.5 text-brand-brown" />
            </div>
          </motion.div>

          {/* Bento Item 5: Directory Hierarchy Control (Col-span 12 lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="col-span-12 lg:col-span-4 bg-brand-cream-muted border-2 border-brand-brown p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#FFA552] hover:shadow-[4px_4px_0px_0px_#FFA552] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-none group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-brand-brown text-brand-cream border-2 border-brand-brown-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#381D2A] rounded-none">
                  <FolderTree className="w-5 h-5 text-brand-peach" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-peach/40 text-brand-brown border border-brand-brown">
                  UNLIMITED NESTING
                </span>
              </div>

              <h3 className="text-xl font-bold text-brand-violet mb-2 group-hover:text-brand-brown transition-colors">
                Hierarchical Organization
              </h3>
              <p className="text-sm text-brand-violet/85 leading-relaxed mb-5">
                Deep folder nesting, instant breadcrumbs, bulk actions, and multi-asset management with zero page reloads.
              </p>

              {/* Directory Tree Visualization */}
              <div className="bg-brand-cream border-2 border-brand-border p-3 space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-brand-violet font-bold">
                  <FolderTree className="w-3.5 h-3.5 text-brand-brown" />
                  <span>/personal-vault</span>
                  <span className="text-[9px] text-brand-peach-vibrant font-bold ml-auto">[LOCKED]</span>
                </div>
                <div className="flex items-center gap-2 text-brand-violet/80 pl-4 border-l border-brand-border">
                  <FileText className="w-3 h-3 text-brand-violet" />
                  <span className="truncate">tax-returns-2026.pdf</span>
                </div>
                <div className="flex items-center gap-2 text-brand-violet/80 pl-4 border-l border-brand-border">
                  <FolderTree className="w-3 h-3 text-brand-peach-vibrant" />
                  <span>/credentials</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-semibold text-brand-violet/80">
              <span>Fast client-side indexing</span>
              <Layers className="w-4 h-4 text-brand-brown" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Features;
