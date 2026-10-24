"use client";

import Link from "next/link";
import { HardDrive, Zap, Trash2, ArrowRight, ShieldCheck, Sparkles, PieChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatFileSize } from "@/lib/file";

const StoragePage = () => {
  const { user } = useAuth();

  const storageUsed = user?.storageUsed ?? 14200000;
  const storageLimit = user?.storageLimit ?? 50 * 1024 * 1024;
  const storagePercent = Math.min(
    100,
    Math.round((storageUsed / (storageLimit || 1)) * 100)
  );

  const breakdowns = [
    { type: "PDF & Documents", size: "6.8 MB", percent: 48, color: "bg-brand-brown" },
    { type: "Images & Media", size: "4.2 MB", percent: 30, color: "bg-brand-peach-vibrant" },
    { type: "Spreadsheets", size: "2.1 MB", percent: 15, color: "bg-emerald-600" },
    { type: "Encrypted Keys & Archives", size: "1.1 MB", percent: 7, color: "bg-brand-violet" },
  ];

  const largestFiles = [
    { name: "Quarterly-Board-Deck.pdf", size: "4.8 MB", date: "Oct 24, 2026" },
    { name: "Demo-Walkthrough.mp4", size: "3.2 MB", date: "Oct 28, 2026" },
    { name: "Financial-Audit-2026.pdf", size: "2.4 MB", date: "Oct 15, 2026" },
  ];

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <HardDrive className="w-3 h-3 text-brand-brown" />
            Storage Utilization & Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Storage Console
          </h1>
          <p className="text-xs text-brand-violet/75">
            Detailed breakdown of your encrypted storage allocation and quota capacity.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Live Storage Mode
        </div>
      </div>

      {/* Main Quota Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-violet/70">
                Active Vault Capacity
              </div>
              <div className="text-3xl font-extrabold text-brand-violet tracking-tight mt-1">
                {formatFileSize(storageUsed)}{" "}
                <span className="text-sm font-normal text-brand-violet/60">
                  / {formatFileSize(storageLimit)}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-brand-peach border border-brand-border text-xs font-bold font-mono">
              {storagePercent}% Quota Used
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-brand-cream-muted border-2 border-brand-violet h-4 overflow-hidden">
            <div
              style={{ width: `${storagePercent}%` }}
              className="bg-brand-brown h-full transition-all duration-300"
            />
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Allocation Breakdown
            </h3>
            <div className="space-y-2">
              {breakdowns.map((b) => (
                <div key={b.type} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 ${b.color} inline-block`} />
                    <span className="font-semibold">{b.type}</span>
                  </div>
                  <div className="font-mono text-brand-violet/80">
                    {b.size} ({b.percent}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Plan Promo */}
        <div className="bg-brand-violet-dark text-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-brown text-brand-cream text-[10px] font-bold uppercase tracking-wider border border-brand-peach-vibrant/40 mb-3">
              <Zap className="w-3 h-3 text-brand-peach" />
              Pro Tier Capacity
            </div>
            <h3 className="text-lg font-extrabold text-brand-cream tracking-tight mb-2">
              Upgrade to 500 MB Encrypted Storage
            </h3>
            <p className="text-xs text-brand-peach/80 leading-relaxed mb-4">
              Expand your zero-knowledge storage with priority chunk uploads, team workspaces, and custom retention rules.
            </p>
          </div>

          <Link
            href="/#pricing"
            className="w-full py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border border-brand-peach text-center shadow-[2px_2px_0px_0px_#26131D] transition-all inline-flex items-center justify-center gap-1.5"
          >
            Explore Pro Plans <ArrowRight className="w-3.5 h-3.5 text-brand-peach" />
          </Link>
        </div>
      </div>

      {/* Largest Files Table */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-brand-border">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
            Largest Stored Files
          </h2>
          <span className="text-[11px] font-mono text-brand-violet/60">
            Consider archiving to save capacity
          </span>
        </div>

        <div className="divide-y divide-brand-border/60">
          {largestFiles.map((f, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <span className="font-bold text-brand-violet truncate">{f.name}</span>
              <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                <span className="text-brand-violet/70">{f.date}</span>
                <span className="font-bold text-brand-brown">{f.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoragePage;

