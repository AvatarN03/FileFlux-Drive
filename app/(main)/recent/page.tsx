"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Clock,
  Download,
  Eye,
  FileText,
  Folder,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { useFiles } from "@/hooks/useFileQueries";
import { useAllFolders } from "@/hooks/useFolderQueries";

import { useVault } from "@/context/VaultContext";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import FilePreviewModal from "../../_components/FilePreviewModel";

import { formatFileSize } from "@/lib/file";
import { downloadAndDecryptFile } from "@/lib/storage/encryptedFileTransfer";
import { toastError, toastSuccess } from "@/lib/toast";

import type { FileItem } from "@/types/file";
import type { AllFolderItem } from "@/types/folder";

type DateFilter = "today" | "week" | "month" | "all";
type TypeFilter = "all" | "files" | "folders";

const dateFilterOptions: { value: DateFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "Last 30 Days" },
  { value: "all", label: "All Time" },
];

const typeFilterOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All items" },
  { value: "files", label: "Files only" },
  { value: "folders", label: "Folders only" },
];

const formatIndianDateTime = (dateVal?: string | Date | null) => {
  if (!dateVal) return "—";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" at ", ", ");
};

const getDateCutoff = (filter: DateFilter) => {
  if (filter === "all") return 0;
  if (filter === "today") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return startOfToday.getTime();
  }
  const days = filter === "week" ? 7 : 30;
  return Date.now() - days * 24 * 60 * 60 * 1000;
};

const getFolderPath = (
  folderId: string | null,
  folderMap: Map<string, AllFolderItem>
) => {
  const segments: string[] = [];
  const visited = new Set<string>();
  let currentId = folderId;

  while (currentId) {
    if (visited.has(currentId)) break;
    visited.add(currentId);

    const folder = folderMap.get(currentId);
    if (!folder) break;

    segments.unshift(folder.name);
    currentId = folder.parentId;
  }

  return segments.length ? `Root / ${segments.join(" / ")}` : "Root";
};

type RecentItem =
  | {
      kind: "file";
      id: string;
      name: string;
      size: number;
      timestamp: string;
      location: string;
      href: string;
      file: FileItem;
    }
  | {
      kind: "folder";
      id: string;
      name: string;
      timestamp: string;
      location: string;
      href: string;
      folder: AllFolderItem;
    };

const RecentRow = ({
  item,
  onPreview,
}: {
  item: RecentItem;
  onPreview: (file: FileItem) => void;
}) => {
  const { vaultKey } = useVault();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (item.kind !== "file") return;

    const file = item.file;

    if (file.isEncrypted) {
      if (!vaultKey) {
        toastError(
          "Please unlock your secure vault to decrypt and download this file."
        );
        return;
      }

      try {
        setIsDownloading(true);
        await downloadAndDecryptFile({ fileId: file.id, vaultKey });
        toastSuccess("File decrypted and downloaded successfully!");
      } catch (err) {
        toastError(
          (err as Error)?.message || "Failed to decrypt and download file"
        );
      } finally {
        setIsDownloading(false);
      }
      return;
    }

    if (file.url) {
      window.open(file.url, "_blank");
      return;
    }

    toastError("No download URL available for this file");
  };

  return (
    <div className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-xs font-medium transition-colors hover:bg-brand-cream-muted/50">
      <div className="col-span-12 flex min-w-0 items-center gap-2.5 sm:col-span-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand-border bg-brand-cream-muted text-brand-brown">
          {item.kind === "folder" ? (
            <Folder className="h-4 w-4 fill-brand-brown/20" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={item.href}
            title={item.name}
            className="block truncate font-bold text-brand-violet transition-colors hover:text-brand-brown hover:underline"
          >
            {item.name}
          </Link>
          <span
            className="block truncate text-[10px] font-mono text-brand-violet/60"
            title={item.location}
          >
            {item.location}
          </span>
        </div>
      </div>

      <div className="col-span-6 text-[11px] font-mono text-brand-violet/70 sm:col-span-3">
        {formatIndianDateTime(item.timestamp)}
      </div>

      <div className="col-span-3 text-right text-[11px] font-mono text-brand-violet/80 sm:col-span-2">
        {item.kind === "file" ? formatFileSize(item.size) : "—"}
      </div>

      <div className="col-span-3 flex items-center justify-end gap-1.5 sm:col-span-2">
        {item.kind === "file" ? (
          <>
            <button
              type="button"
              onClick={() => onPreview(item.file)}
              title="Preview"
              aria-label={`Preview ${item.name}`}
              className="cursor-pointer border border-brand-border bg-brand-cream-muted p-1.5 text-brand-violet transition-colors hover:bg-brand-peach"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download"
              aria-label={`Download ${item.name}`}
              className="cursor-pointer bg-brand-brown p-1.5 text-brand-cream transition-colors hover:bg-brand-brown-dark disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
            </button>
          </>
        ) : (
          <Link
            href={item.href}
            title="Open folder"
            aria-label={`Open ${item.name}`}
            className="border border-brand-border bg-brand-cream-muted p-1.5 text-brand-violet transition-colors hover:bg-brand-peach"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

const RecentPage = () => {
  const { data: rawFiles = [], isLoading: filesLoading, isError: filesError } =
    useFiles({ folderId: null });
  const {
    data: folders = [],
    isLoading: foldersLoading,
    isError: foldersError,
  } = useAllFolders();
  const { isUnlocked } = useVault();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);

  const isLoading = filesLoading || foldersLoading;
  const isError = filesError || foldersError;

  const previewFile = rawFiles.find((file) => file.id === previewFileId) ?? null;

  const folderMap = useMemo(
    () => new Map(folders.map((folder) => [folder.id, folder])),
    [folders]
  );

  const recentItems = useMemo<RecentItem[]>(() => {
    const fileItems: RecentItem[] = rawFiles.map((file) => ({
      kind: "file",
      id: `file-${file.id}`,
      name: file.extension ? `${file.name}.${file.extension}` : file.name,
      size: file.size,
      timestamp: file.updatedAt || file.createdAt,
      location: getFolderPath(file.folderId, folderMap),
      href: file.folderId ? `/folders/${file.folderId}` : "/files",
      file,
    }));

    const folderItems: RecentItem[] = folders.map((folder) => ({
      kind: "folder",
      id: `folder-${folder.id}`,
      name: folder.name,
      timestamp: folder.updatedAt || folder.createdAt,
      location: getFolderPath(folder.parentId, folderMap),
      href: `/folders/${folder.id}`,
      folder,
    }));

    return [...fileItems, ...folderItems].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [rawFiles, folders, folderMap]);

  const effectiveSearch = isUnlocked ? searchTerm.trim().toLowerCase() : "";

  const filteredItems = useMemo(() => {
    const cutoff = getDateCutoff(dateFilter);

    return recentItems.filter((item) => {
      if (cutoff && new Date(item.timestamp).getTime() < cutoff) {
        return false;
      }

      if (typeFilter === "files" && item.kind !== "file") return false;
      if (typeFilter === "folders" && item.kind !== "folder") return false;

      if (effectiveSearch) {
        const haystack = `${item.name} ${item.location}`.toLowerCase();
        if (!haystack.includes(effectiveSearch)) return false;
      }

      return true;
    });
  }, [recentItems, dateFilter, typeFilter, effectiveSearch]);

  const hasActiveFilters =
    Boolean(effectiveSearch) || typeFilter !== "all" || dateFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="mx-auto w-full min-h-full max-w-[1600px] space-y-6 p-4 text-brand-violet sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-2 border-brand-violet bg-brand-cream p-5 shadow-brown-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 border border-brand-border bg-brand-peach px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-violet">
            <Clock className="h-3 w-3 text-brand-brown" />
            Recently Modified
          </div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Recent
          </h1>
          <p className="text-xs text-brand-violet/75">
            Files and folders you added or changed recently, newest first.
          </p>
        </div>
      </div>

      {/* Filters */}
      {!isLoading && !isError && recentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 border-2 border-brand-border bg-brand-cream-muted p-3 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={dateFilter}
                onValueChange={(next) => {
                  if (
                    next === "today" ||
                    next === "week" ||
                    next === "month" ||
                    next === "all"
                  ) {
                    setDateFilter(next);
                  }
                }}
              >
                <SelectTrigger
                  aria-label="Filter by date range"
                  className="h-10 w-full shrink-0 rounded-none border-2 border-brand-border bg-brand-cream px-3 text-xs font-bold text-brand-violet shadow-none focus:border-brand-brown focus:ring-0 sm:w-40"
                >
                  <span className="truncate">
                    {dateFilterOptions.find(
                      (option) => option.value === dateFilter
                    )?.label ?? "All Time"}
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-brand-violet bg-brand-cream text-brand-violet">
                  {dateFilterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-none py-2 text-xs font-bold focus:bg-brand-peach focus:text-brand-violet"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={(next) => {
                  if (next === "all" || next === "files" || next === "folders") {
                    setTypeFilter(next);
                  }
                }}
              >
                <SelectTrigger
                  aria-label="Filter by item type"
                  className="h-10 w-full shrink-0 rounded-none border-2 border-brand-border bg-brand-cream px-3 text-xs font-bold text-brand-violet shadow-none focus:border-brand-brown focus:ring-0 sm:w-40"
                >
                  <span className="truncate">
                    {typeFilterOptions.find(
                      (option) => option.value === typeFilter
                    )?.label ?? "All items"}
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-brand-violet bg-brand-cream text-brand-violet">
                  {typeFilterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-none py-2 text-xs font-bold focus:bg-brand-peach focus:text-brand-violet"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex min-w-0 flex-1 items-center border-2 border-brand-border bg-brand-cream transition focus-within:border-brand-brown">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-brand-brown" />
              <input
                type="search"
                value={effectiveSearch}
                disabled={!isUnlocked}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={
                  isUnlocked
                    ? "Filter recent items..."
                    : "Unlock vault to search names"
                }
                aria-label="Filter recent items"
                className="h-10 w-full bg-transparent px-9 text-xs font-semibold text-brand-violet outline-none placeholder:text-brand-violet/40 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {effectiveSearch && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear recent search"
                  className="absolute right-2.5 text-brand-violet/60 transition-colors hover:text-brand-violet"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-brand-violet/65">
            <span>
              Showing {filteredItems.length} of {recentItems.length} item
              {recentItems.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-3">
              {!isUnlocked && <span>Unlock vault to search names.</span>}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-bold text-brand-brown underline-offset-2 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="border-2 border-brand-violet bg-brand-cream p-8 py-16 text-center text-xs font-mono text-brand-violet/60 shadow-brown-4">
          Loading recent items...
        </div>
      ) : isError ? (
        <div className="border-2 border-red-500 bg-red-100 p-4 text-xs font-bold text-red-800">
          Failed to load recent items.
        </div>
      ) : recentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-brand-violet bg-brand-cream p-8 py-16 text-center shadow-brown-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center border-2 border-brand-violet bg-brand-peach shadow-violet-2">
            <Clock className="h-6 w-6 text-brand-brown" />
          </div>
          <h3 className="text-sm font-bold text-brand-violet">
            No recent items yet
          </h3>
          <p className="mt-1 max-w-sm text-xs text-brand-violet/60">
            Files you upload and folders you create will appear here, newest
            first.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/files"
              className="border-2 border-brand-violet bg-brand-brown px-4 py-2 text-xs font-bold text-brand-cream shadow-violet-2 transition-all hover:bg-brand-brown-dark"
            >
              Browse Files
            </Link>
            <Link
              href="/folders"
              className="border-2 border-brand-border bg-brand-cream px-4 py-2 text-xs font-bold text-brand-violet transition-all hover:bg-brand-cream-muted"
            >
              Browse Folders
            </Link>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-brand-violet bg-brand-cream p-8 py-16 text-center shadow-brown-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center border-2 border-brand-violet bg-brand-peach shadow-violet-2">
            <Search className="h-6 w-6 text-brand-brown" />
          </div>
          <h3 className="text-sm font-bold text-brand-violet">
            No items match your filters
          </h3>
          <p className="mt-1 max-w-sm text-xs text-brand-violet/60">
            Try a wider date range or switch the type filter to see more
            recent items.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 border-2 border-brand-violet bg-brand-brown px-4 py-2 text-xs font-bold text-brand-cream shadow-violet-2 transition-all hover:bg-brand-brown-dark"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-hidden border-2 border-brand-violet bg-brand-cream shadow-brown-4">
          <div className="hidden grid-cols-12 border-b-2 border-brand-border bg-brand-cream-muted px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-brand-violet sm:grid">
            <span className="col-span-5">Item</span>
            <span className="col-span-3">Modified</span>
            <span className="col-span-2 text-right">Size</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          <div className="divide-y divide-brand-border/60">
            {filteredItems.map((item) => (
              <RecentRow
                key={item.id}
                item={item}
                onPreview={(file) => setPreviewFileId(file.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFileId(null)}
        />
      )}
    </div>
  );
};

export default RecentPage;
