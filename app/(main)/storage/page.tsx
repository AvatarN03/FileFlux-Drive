"use client";

import { useMemo } from "react";
import Link from "next/link";

import { FileText, HardDrive, Inbox, Lock } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useFiles, useTrashFiles } from "@/hooks/useFileQueries";

import { formatFileSize } from "@/lib/file";

import type { FileItem } from "@/types/file";

type StorageCategoryKey =
  | "photos"
  | "videos"
  | "pdfs"
  | "documents"
  | "spreadsheets"
  | "presentations"
  | "audio"
  | "archives"
  | "other";

type StorageBreakdownRow = {
  key: StorageCategoryKey | "trash";
  label: string;
  color: string;
  bytes: number;
  count: number;
  size: string;
  percent: number;
};

const EXTENSION_CATEGORIES: Record<string, StorageCategoryKey> = {
  // Photos
  jpg: "photos",
  jpeg: "photos",
  png: "photos",
  gif: "photos",
  webp: "photos",
  svg: "photos",
  heic: "photos",
  heif: "photos",
  avif: "photos",
  bmp: "photos",
  tif: "photos",
  tiff: "photos",
  // Videos
  mp4: "videos",
  mov: "videos",
  webm: "videos",
  mkv: "videos",
  avi: "videos",
  m4v: "videos",
  mpeg: "videos",
  mpg: "videos",
  // PDFs
  pdf: "pdfs",
  // Documents
  doc: "documents",
  docx: "documents",
  txt: "documents",
  rtf: "documents",
  odt: "documents",
  md: "documents",
  pages: "documents",
  // Spreadsheets
  xls: "spreadsheets",
  xlsx: "spreadsheets",
  csv: "spreadsheets",
  ods: "spreadsheets",
  numbers: "spreadsheets",
  // Presentations
  ppt: "presentations",
  pptx: "presentations",
  odp: "presentations",
  key: "presentations",
  // Audio
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
  m4a: "audio",
  aac: "audio",
  // Archives
  zip: "archives",
  rar: "archives",
  "7z": "archives",
  tar: "archives",
  gz: "archives",
  bz2: "archives",
  xz: "archives",
};

const STORAGE_CATEGORY_ORDER: StorageCategoryKey[] = [
  "photos",
  "videos",
  "pdfs",
  "documents",
  "spreadsheets",
  "presentations",
  "audio",
  "archives",
  "other",
];

const STORAGE_CATEGORY_META: Record<
  StorageCategoryKey,
  { label: string; color: string }
> = {
  photos: { label: "Photos", color: "bg-brand-peach-vibrant" },
  videos: { label: "Videos", color: "bg-brand-violet" },
  pdfs: { label: "PDFs", color: "bg-brand-peach" },
  documents: { label: "Documents", color: "bg-brand-brown" },
  spreadsheets: { label: "Spreadsheets", color: "bg-emerald-600" },
  presentations: { label: "Presentations", color: "bg-amber-500" },
  audio: { label: "Audio", color: "bg-blue-600" },
  archives: { label: "Archives", color: "bg-slate-600" },
  other: { label: "Other files", color: "bg-brand-violet-light" },
};

const getStorageCategory = (file: FileItem): StorageCategoryKey => {
  const extension = file.extension.toLowerCase().replace(/^\./, "");
  const byExtension = EXTENSION_CATEGORIES[extension];

  if (byExtension) return byExtension;

  const mimeType = file.mimeType.toLowerCase();

  if (mimeType === "application/pdf") return "pdfs";
  if (mimeType.startsWith("image/")) return "photos";
  if (mimeType.startsWith("video/")) return "videos";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return "spreadsheets";
  }
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    return "presentations";
  }
  if (mimeType.includes("word") || mimeType.includes("opendocument.text")) {
    return "documents";
  }
  if (
    mimeType.includes("zip") ||
    mimeType.includes("compressed") ||
    mimeType.includes("archive")
  ) {
    return "archives";
  }

  return "other";
};

const StoragePage = () => {
  const { user } = useAuth();
  const {
    data: rawFiles = [],
    isLoading: filesLoading,
    isError,
  } = useFiles({
    folderId: null,
  });
  const {
    data: trashFiles = [],
    isLoading: trashLoading,
    isError: trashError,
  } = useTrashFiles();

  const isLoading = filesLoading || trashLoading;

  const storageUsed = user?.storageUsed ?? 0;
  const storageLimit = user?.storageLimit ?? 50 * 1024 * 1024;
  const storagePercent = Math.min(
    100,
    Math.round((storageUsed / (storageLimit || 1)) * 100)
  );

  const breakdowns = useMemo(() => {
    const totals = new Map<
      StorageCategoryKey,
      { bytes: number; count: number }
    >();

    rawFiles.forEach((file) => {
      const key = getStorageCategory(file);
      const current = totals.get(key) ?? { bytes: 0, count: 0 };
      current.bytes += file.size;
      current.count += 1;
      totals.set(key, current);
    });

    const trashBytes = trashFiles.reduce((sum, file) => sum + file.size, 0);
    const activeBytes = [...totals.values()].reduce(
      (sum, total) => sum + total.bytes,
      0
    );
    const accountedBytes = activeBytes + trashBytes;

    if (accountedBytes === 0) {
      return { rows: [] as StorageBreakdownRow[], totalBytes: 0 };
    }

    const rows: StorageBreakdownRow[] = STORAGE_CATEGORY_ORDER.flatMap((key) => {
      const total = totals.get(key);
      if (!total || total.bytes === 0) return [];

      return [
        {
          key,
          label: STORAGE_CATEGORY_META[key].label,
          color: STORAGE_CATEGORY_META[key].color,
          bytes: total.bytes,
          count: total.count,
          size: formatFileSize(total.bytes),
          percent: Math.round((total.bytes / accountedBytes) * 100),
        },
      ];
    });

    if (trashBytes > 0) {
      rows.push({
        key: "trash",
        label: "In Trash",
        color: "bg-brand-violet-light",
        bytes: trashBytes,
        count: trashFiles.length,
        size: formatFileSize(trashBytes),
        percent: Math.round((trashBytes / accountedBytes) * 100),
      });
    }

    return { rows, totalBytes: accountedBytes };
  }, [rawFiles, trashFiles]);

  const largestFiles = useMemo(() => {
    return [...rawFiles]
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);
  }, [rawFiles]);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
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

      {!isError && (
        <div className="flex items-start gap-2 bg-brand-peach border-2 border-brand-violet px-4 py-3 text-xs text-brand-violet shadow-violet-2">
          <Lock className="w-4 h-4 text-brand-brown shrink-0 mt-0.5" />
          <p>
            Vault contents stay encrypted on the client. Quota and size analytics remain available while the vault is locked; file names are only shown after local unlock.
          </p>
        </div>
      )}

      {/* Main Quota Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5 space-y-4">
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
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                Allocation Breakdown
              </h3>
              {!isLoading && !isError && breakdowns.totalBytes > 0 && (
                <span className="text-[10px] font-mono text-brand-violet/60">
                  {formatFileSize(breakdowns.totalBytes)} tracked
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-4 text-center text-xs text-brand-violet/60 font-mono">
                Loading allocation breakdown...
              </div>
            ) : isError ? (
              <div className="py-4 px-3 bg-brand-cream-muted border border-dashed border-brand-brown text-center">
                <p className="text-xs font-bold text-brand-violet">Storage data is temporarily unavailable</p>
                <p className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
                  Refresh the page and try again.
                </p>
              </div>
            ) : breakdowns.rows.length === 0 ? (
              <div className="py-4 px-3 bg-brand-cream-muted border border-dashed border-brand-border text-center">
                <p className="text-xs font-bold text-brand-violet">No storage allocation data</p>
                <p className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
                  0 Bytes allocated across all categories. Upload files to see real-time breakdown.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex h-4 w-full overflow-hidden border-2 border-brand-violet bg-brand-cream-muted">
                  {breakdowns.rows.map((row) => (
                    <div
                      key={row.key}
                      style={{ width: `${row.percent}%` }}
                      className={row.color}
                      title={`${row.label}: ${row.size} (${row.percent}%)`}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  {breakdowns.rows.map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`w-3 h-3 ${row.color} inline-block shrink-0`} />
                        <span className="truncate font-semibold">{row.label}</span>
                        <span className="shrink-0 text-[10px] font-mono text-brand-violet/50">
                          {row.count} file{row.count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="shrink-0 font-mono text-brand-violet/80">
                        {row.size} ({row.percent}%)
                      </div>
                    </div>
                  ))}
                </div>

                {trashError && (
                  <p className="text-[10px] font-mono text-brand-brown">
                    Trash usage is temporarily unavailable and is not included above.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Largest Files Table */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5 space-y-4">
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
        ) : isError ? (
          <div className="py-8 px-4 bg-brand-cream-muted border-2 border-dashed border-brand-brown text-center">
            <p className="text-xs font-bold text-brand-violet">Stored files are temporarily unavailable</p>
            <p className="text-[11px] font-mono text-brand-violet/60 mt-1">
              Refresh the page and try again.
            </p>
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
              className="mt-3 px-3 py-1.5 bg-brand-brown text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-violet-2 hover:bg-brand-brown-dark transition-all"
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
