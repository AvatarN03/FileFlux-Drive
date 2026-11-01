"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HardDrive, Zap, ArrowRight, FileText, Inbox } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFiles } from "@/hooks/useFileQueries";
import { formatFileSize } from "@/lib/file";
import { getFileCategoryFilter } from "@/lib/file/operations";

const StoragePage = () => {
  const { user } = useAuth();
  const { data: rawFiles = [], isLoading } = useFiles({
    folderId: null,
  });

  const storageUsed = user?.storageUsed ?? 0;
  const storageLimit = user?.storageLimit ?? 50 * 1024 * 1024;
  const storagePercent = Math.min(
    100,
    Math.round((storageUsed / (storageLimit || 1)) * 100)
  );

  const breakdowns = useMemo(() => {
    let docBytes = 0;
    let imgBytes = 0;
    let sheetBytes = 0;
    let otherBytes = 0;

    rawFiles.forEach((f) => {
      const cat = getFileCategoryFilter(f);
      if (cat === "document") {
        docBytes += f.size;
      } else if (cat === "image" || cat === "video") {
        imgBytes += f.size;
      } else if (cat === "spreadsheet") {
        sheetBytes += f.size;
      } else {
        otherBytes += f.size;
      }
    });

    const totalBytes = docBytes + imgBytes + sheetBytes + otherBytes;

    if (totalBytes === 0) return [];

    const categories = [
      {
        type: "PDF & Documents",
        bytes: docBytes,
        size: formatFileSize(docBytes),
        percent: Math.round((docBytes / totalBytes) * 100),
        color: "bg-brand-brown",
      },
      {
        type: "Images & Media",
        bytes: imgBytes,
        size: formatFileSize(imgBytes),
        percent: Math.round((imgBytes / totalBytes) * 100),
        color: "bg-brand-peach-vibrant",
      },
      {
        type: "Spreadsheets",
        bytes: sheetBytes,
        size: formatFileSize(sheetBytes),
        percent: Math.round((sheetBytes / totalBytes) * 100),
        color: "bg-emerald-600",
      },
      {
        type: "Encrypted Keys & Archives",
        bytes: otherBytes,
        size: formatFileSize(otherBytes),
        percent: Math.round((otherBytes / totalBytes) * 100),
        color: "bg-brand-violet",
      },
    ];

    return categories.filter((c) => c.bytes > 0);
  }, [rawFiles]);

  const largestFiles = useMemo(() => {
    return [...rawFiles]
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);
  }, [rawFiles]);

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

          {/* Allocation Breakdown */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Allocation Breakdown
            </h3>

            {isLoading ? (
              <div className="py-4 text-center text-xs text-brand-violet/60 font-mono">
                Loading allocation breakdown...
              </div>
            ) : breakdowns.length === 0 ? (
              <div className="py-4 px-3 bg-brand-cream-muted border border-dashed border-brand-border text-center">
                <p className="text-xs font-bold text-brand-violet">No storage allocation data</p>
                <p className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
                  0 Bytes allocated across all categories. Upload files to see real-time breakdown.
                </p>
              </div>
            ) : (
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
            )}
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
            Sorted by encrypted size
          </span>
        </div>

        {isLoading ? (
          <div className="py-6 text-center text-xs text-brand-violet/60 font-mono">
            Loading stored files...
          </div>
        ) : largestFiles.length === 0 ? (
          <div className="py-8 px-4 bg-brand-cream-muted border-2 border-dashed border-brand-border text-center flex flex-col items-center justify-center">
            <Inbox className="w-8 h-8 text-brand-brown/40 mb-2" />
            <p className="text-xs font-bold text-brand-violet">No files stored in your vault</p>
            <p className="text-[11px] font-mono text-brand-violet/60 mt-1">
              Files uploaded to FileFlux will appear here sorted by size.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 px-3 py-1.5 bg-brand-brown text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] hover:bg-brand-brown-dark transition-all"
            >
              Go to Dashboard to Upload
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-brand-border/60">
            {largestFiles.map((f) => (
              <div key={f.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <FileText className="w-4 h-4 text-brand-brown shrink-0" />
                  <span className="font-bold text-brand-violet truncate">{f.name}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                  <span className="text-brand-violet/70">
                    {new Date(f.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold text-brand-brown">{formatFileSize(f.size)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoragePage;
