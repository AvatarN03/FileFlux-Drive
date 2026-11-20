"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HardDrive,
  FolderTree,
  FileText,
  ShieldCheck,
  ArrowRight,
  Search,
  Lock,
  FolderPlus,
  Activity,
  Zap,
  UploadCloud,
  CheckCircle2,
  Clock,
} from "lucide-react";

import FileList from "../../_components/FileList";
import FilePreviewModal from "../../_components/FilePreviewModel";
import FileDetailsModal from "../../_components/FileDetailModel";
import FileEditModal from "../../_components/FileEditModel";
import FileMoveModal from "../../_components/files/FileMoveModal";
import AddFolderModal from "@/components/folders/AddFolderModal";
import VaultUnlockModal from "../../_components/vault/VaultUnlockModal";
import VaultSetupModal from "../../_components/vault/VaultSetupModal";
import UploadButton from "@/app/_components/upload/UploadButton";

import { useAuth } from "@/hooks/useAuth";
import { useVault } from "@/context/VaultContext";
import { useFiles } from "@/hooks/useFileQueries";
import { useFoldersAll } from "@/hooks/useFolderQueries";
import { useFolderCreate } from "@/hooks/useFolderMutations";
import { FileModalProvider, useFileModal } from "@/context/FileModalContext";
import { formatFileSize } from "@/lib/file";
import { getFileCategoryFilter } from "@/lib/file/operations";
import { FileItem } from "@/types/file";
import { FOLDER_COLOR_OPTIONS } from "@/types/folder";
import toastC from "@/lib/toast";

type CategoryFilter =
  | "all"
  | "document"
  | "pdf"
  | "image"
  | "video"
  | "spreadsheet";

type StorageSegment = {
  label: string;
  count: number;
  bytes: number;
  color: string;
};

const polarToCartesian = (center: number, radius: number, angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
};

const describeDonutSegment = (
  startAngle: number,
  endAngle: number,
  outerRadius: number,
  innerRadius: number
) => {
  const center = 100;
  const outerStart = polarToCartesian(center, outerRadius, endAngle);
  const outerEnd = polarToCartesian(center, outerRadius, startAngle);
  const innerStart = polarToCartesian(center, innerRadius, endAngle);
  const innerEnd = polarToCartesian(center, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

const StorageDonutChart = ({
  segments,
  totalBytes,
}: {
  segments: StorageSegment[];
  totalBytes: number;
}) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const visibleSegments = segments.filter((segment) => segment.bytes > 0);
  const hoveredSegment = segments.find(
    (segment) => segment.label === hoveredLabel
  );
  const arcs = visibleSegments.map((segment, index) => {
    const startAngle = visibleSegments
      .slice(0, index)
      .reduce(
        (sum, current) =>
          sum + (totalBytes ? (current.bytes / totalBytes) * 360 : 0),
        0
      );
    const sweep = totalBytes ? (segment.bytes / totalBytes) * 360 : 0;
    const endAngle = startAngle + (sweep >= 360 ? 359.999 : sweep);

    return {
      segment,
      path: describeDonutSegment(startAngle, endAngle, 78, 47),
    };
  });

  const hoveredPercent = hoveredSegment && totalBytes
    ? Math.round((hoveredSegment.bytes / totalBytes) * 100)
    : 0;

  return (
    <div className="relative w-48 h-48" aria-label="Storage distribution">
      <svg
        viewBox="0 0 200 200"
        role="img"
        className="w-full h-full drop-shadow-violet-3"
        aria-label={`Storage distribution across ${visibleSegments.length} file categories`}
      >
        {arcs.length > 0 ? (
          arcs.map(({ segment, path }) => (
            <path
              key={segment.label}
              d={path}
              fill={segment.color}
              stroke="var(--brand-cream)"
              strokeWidth="2"
              tabIndex={0}
              aria-label={`${segment.label}: ${formatFileSize(segment.bytes)}, ${segment.count} files`}
              className="cursor-pointer transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none"
              onMouseEnter={() => setHoveredLabel(segment.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              onFocus={() => setHoveredLabel(segment.label)}
              onBlur={() => setHoveredLabel(null)}
            />
          ))
        ) : (
          <circle
            cx="100"
            cy="100"
            r="62"
            fill="var(--brand-cream-muted)"
            stroke="var(--brand-cream)"
            strokeWidth="2"
          />
        )}
      </svg>

      <div className="absolute inset-8 rounded-full bg-brand-cream border-2 border-brand-violet flex flex-col items-center justify-center text-center px-2 pointer-events-none">
        {hoveredSegment ? (
          <>
            <span className="text-xs font-extrabold text-brand-violet truncate max-w-full">
              {hoveredSegment.label}
            </span>
            <span className="text-sm font-extrabold text-brand-brown">
              {formatFileSize(hoveredSegment.bytes)}
            </span>
            <span className="text-[10px] font-mono text-brand-violet/60">
              {hoveredPercent}% · {hoveredSegment.count} files
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-extrabold text-brand-violet">
              {formatFileSize(totalBytes)}
            </span>
            <span className="text-[10px] font-mono text-brand-violet/60">
              categorized files
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const { user } = useAuth();
  const { isEnrolled, isUnlocked, lockVault } = useVault();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState<string>(FOLDER_COLOR_OPTIONS[0].value);
  const [newFolderFavorite, setNewFolderFavorite] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Queries
  const {
    data: rawFiles = [],
    isLoading: filesLoading,
    isError: filesError,
  } = useFiles({
    folderId: null,
  });
  const {
    data: folders = [],
    isLoading: foldersLoading,
    isError: foldersError,
  } = useFoldersAll(null);
  const { mutate: createFolder, isPending: isCreatingFolder } = useFolderCreate();

  const { mode, file: modalFile, closeModal } = useFileModal();

  // Storage metrics
  const storageUsed = user?.storageUsed ?? 0;
  const storageLimit = user?.storageLimit ?? 50 * 1024 * 1024;
  const storagePercent = Math.min(
    100,
    Math.round((storageUsed / (storageLimit || 1)) * 100)
  );
  const remainingBytes = Math.max(0, storageLimit - storageUsed);

  // Categorized breakdown
  const categoryStats = useMemo(() => {
    let docs = 0;
    let pdfs = 0;
    let images = 0;
    let videos = 0;
    let sheets = 0;
    let other = 0;

    let docBytes = 0;
    let pdfBytes = 0;
    let imgBytes = 0;
    let vidBytes = 0;
    let sheetBytes = 0;
    let otherBytes = 0;

    rawFiles.forEach((f) => {
      const cat = getFileCategoryFilter(f);
      if (cat === "document") {
        docs++;
        docBytes += f.size;
      } else if (cat === "pdf") {
        pdfs++;
        pdfBytes += f.size;
      } else if (cat === "image") {
        images++;
        imgBytes += f.size;
      } else if (cat === "video") {
        videos++;
        vidBytes += f.size;
      } else if (cat === "spreadsheet") {
        sheets++;
        sheetBytes += f.size;
      } else {
        other++;
        otherBytes += f.size;
      }
    });

    return {
      docs,
      pdfs,
      images,
      videos,
      sheets,
      other,
      docBytes,
      pdfBytes,
      imgBytes,
      vidBytes,
      sheetBytes,
      otherBytes,
    };
  }, [rawFiles]);

  const storageSegments: StorageSegment[] = [
    {
      label: "Documents",
      count: categoryStats.docs,
      bytes: categoryStats.docBytes,
      color: "var(--brand-brown)",
    },
    {
      label: "PDFs",
      count: categoryStats.pdfs,
      bytes: categoryStats.pdfBytes,
      color: "var(--brand-peach)",
    },
    {
      label: "Images",
      count: categoryStats.images,
      bytes: categoryStats.imgBytes,
      color: "var(--brand-peach-vibrant)",
    },
    {
      label: "Spreadsheets",
      count: categoryStats.sheets,
      bytes: categoryStats.sheetBytes,
      color: "#059669",
    },
    {
      label: "Media",
      count: categoryStats.videos,
      bytes: categoryStats.vidBytes,
      color: "var(--brand-violet)",
    },
    {
      label: "Other",
      count: categoryStats.other,
      bytes: categoryStats.otherBytes,
      color: "var(--brand-violet-light)",
    },
  ];
  const categorizedBytes = storageSegments.reduce(
    (total, segment) => total + segment.bytes,
    0
  );

  // Filtered recent files
  const filteredFiles = useMemo(() => {
    let list = [...rawFiles];

    if (activeCategory !== "all") {
      list = list.filter((f) => getFileCategoryFilter(f) === activeCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rawFiles, activeCategory, searchTerm]);

  // Handle new folder
  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    if (trimmed.length < 3) {
      toastC({
        data: "Folder name must be at least 3 characters.",
        type: "error",
      });
      return;
    }

    createFolder(
      {
        name: trimmed,
        parentId: null,
        color: newFolderColor,
        isFavorite: newFolderFavorite,
      },
      {
        onSuccess: () => {
          setNewFolderName("");
          setNewFolderColor(FOLDER_COLOR_OPTIONS[0].value);
          setNewFolderFavorite(false);
          setShowAddFolder(false);
          toastC({ data: "Folder created successfully", type: "success" });
        },
        onError: (err) => {
          toastC({
            data: err.message || "Failed to create folder",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Overview introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-violet tracking-tight">
            Workspace Overview
          </h1>
          <p className="mt-1 text-sm text-brand-violet/75 font-medium max-w-2xl">
            Review your encrypted files, storage, and folders from one secure workspace.
          </p>
        </div>

        <div className="flex flex-nowrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddFolder(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-cream-muted text-brand-violet hover:bg-brand-peach font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-brown-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <FolderPlus className="w-4 h-4 text-brand-brown" />
            Add Folder
          </button>
          <UploadButton
            label="Upload File"
            className="px-4 py-2 bg-brand-peach hover:bg-brand-peach-vibrant text-brand-violet text-xs font-bold uppercase tracking-wider border-2 border-brand-violet shadow-brown-2 transition-all whitespace-nowrap"
          />
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Storage Capacity */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet/70">
              Storage Used
            </span>
            <div className="p-1.5 bg-brand-cream-muted border border-brand-border text-brand-brown">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-brand-violet tracking-tight">
              {formatFileSize(storageUsed)}
            </div>
            <div className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
              of {formatFileSize(storageLimit)} quota ({storagePercent}%)
            </div>
          </div>
          {/* Progress track */}
          <div className="mt-3 w-full bg-brand-cream-muted border border-brand-violet h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                storagePercent > 85 ? "bg-red-600" : "bg-brand-brown"
              }`}
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Total Files */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet/70">
              Vault Documents
            </span>
            <div className="p-1.5 bg-brand-cream-muted border border-brand-border text-brand-brown">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-brand-violet tracking-tight">
              {rawFiles.length}
            </div>
            <div className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
              Zero-knowledge encrypted files
            </div>
          </div>
          <Link
            href="/files"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-brown hover:text-brand-brown-dark transition-colors"
          >
            Explore all files <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 3: Active Folders */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet/70">
              Folder Workspaces
            </span>
            <div className="p-1.5 bg-brand-cream-muted border border-brand-border text-brand-brown">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-brand-violet tracking-tight">
              {folders.length}
            </div>
            <div className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
              Folders in your vault
            </div>
          </div>
          <Link
            href="/folders"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-brown hover:text-brand-brown-dark transition-colors"
          >
            Manage folders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 4: Security Shield */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet/70">
              Security Protocol
            </span>
            <div className="p-1.5 bg-brand-peach border border-brand-violet text-brand-violet">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-brand-violet tracking-tight">
              {isUnlocked ? "Unlocked" : "Locked"}
            </div>
            <div className="text-[11px] font-mono text-brand-violet/60 mt-0.5">
              End-to-end encrypted vault
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Keys never leave your device
          </div>
        </div>
      </div>

      {/* Main Split: Left 8 Cols (Folders & Recent Files) + Right 4 Cols (Storage & Services) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Workspaces & Recent Files (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Folders Strip */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-brand-border">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-brand-brown" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Workspace Folders
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/folders"
                  className="text-xs font-bold text-brand-violet/70 hover:text-brand-violet"
                >
                  View All ({folders.length}) →
                </Link>
              </div>
            </div>

            {foldersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-brand-cream-muted border border-brand-border" />
                ))}
              </div>
            ) : foldersError ? (
              <div className="p-6 bg-brand-cream-muted border-2 border-dashed border-brand-brown text-center">
                <p className="text-xs font-bold text-brand-violet mb-1">
                  Folders are temporarily unavailable.
                </p>
                <p className="text-[11px] font-mono text-brand-violet/60">
                  Refresh the page and try again.
                </p>
              </div>
            ) : folders.length === 0 ? (
              <div className="p-6 bg-brand-cream-muted border-2 border-dashed border-brand-border text-center">
                <p className="text-xs font-bold text-brand-violet mb-2">
                  No folders created yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddFolder(true)}
                  className="px-3 py-1.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-brown shadow-violet-2 cursor-pointer transition-all"
                >
                  + Create First Folder
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {folders.slice(0, 6).map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/folders/${folder.id}`}
                    className="flex items-center gap-3 p-3 bg-brand-cream-muted border-2 border-brand-border hover:border-brand-brown hover:bg-brand-cream shadow-brown-2 hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    <div className="w-8 h-8 bg-brand-peach border border-brand-violet/40 flex items-center justify-center shrink-0">
                      <FolderTree className="w-4 h-4 text-brand-brown" />
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-bold text-brand-violet truncate">
                        {folder.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Files Table / Grid */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-brand-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-brown" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Recent Vault Files
                </h2>
                <span className="text-[10px] font-mono bg-brand-peach px-2 py-0.5 border border-brand-border font-bold">
                  {filteredFiles.length}
                </span>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-brand-cream-muted border-2 border-brand-border px-3 py-1.5 focus-within:border-brand-brown">
                <Search className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by name..."
                  className="bg-transparent text-xs text-brand-violet placeholder:text-brand-violet/50 focus:outline-none w-36 sm:w-48 font-medium"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-brand-border/60">
              {[
                { id: "all", label: "All Items" },
                { id: "document", label: "Documents" },
                { id: "pdf", label: "PDFs" },
                { id: "image", label: "Images" },
                { id: "spreadsheet", label: "Spreadsheets" },
                { id: "video", label: "Media" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                  className={`px-3 py-1 text-xs font-bold border-2 transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? "bg-brand-brown text-brand-cream border-brand-brown shadow-violet-2"
                      : "bg-brand-cream-muted text-brand-violet border-brand-border hover:bg-brand-cream"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Files View */}
            {filesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-brand-cream-muted border border-brand-border" />
                ))}
              </div>
            ) : filesError ? (
              <div className="py-12 px-4 text-center bg-brand-cream-muted border-2 border-dashed border-brand-brown">
                <h3 className="text-sm font-extrabold text-brand-violet mb-1">
                  Files are temporarily unavailable
                </h3>
                <p className="text-xs text-brand-violet/70 max-w-sm mx-auto">
                  Refresh the page and try again. Your encrypted files remain in the vault.
                </p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="py-12 px-4 text-center bg-brand-cream-muted border-2 border-dashed border-brand-border">
                <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-violet-2">
                  <UploadCloud className="w-6 h-6 text-brand-brown" />
                </div>
                <h3 className="text-sm font-extrabold text-brand-violet mb-1">
                  No files found
                </h3>
                <p className="text-xs text-brand-violet/70 max-w-sm mx-auto mb-4 font-medium">
                  Use the Upload File button above to add files to your
                  workspace.
                </p>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-xs font-bold text-brand-brown underline underline-offset-2"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredFiles.slice(0, 12).map((file: FileItem) => (
                  <FileList key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Security & Activity Stream (4 Cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 self-start space-y-6">
          {/* Compact Storage Distribution */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-border">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-brown" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Storage Overview
                </h2>
              </div>
              <span className="text-[10px] font-mono text-brand-violet/70">
                {formatFileSize(remainingBytes)} free
              </span>
            </div>

            <div className="flex justify-center">
              <StorageDonutChart
                segments={storageSegments}
                totalBytes={categorizedBytes}
              />
            </div>
          </div>

          {/* Personal Vault State Insight Card */}
          <div className="bg-brand-violet-dark text-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-violet-light">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-peach" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cream">
                  Vault Security
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-brand-brown text-brand-cream px-2 py-0.5 border border-brand-peach-vibrant/40 font-bold">
                E2E Encrypted
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-brand-violet-light/50">
                <span className="text-brand-cream/70">Vault Status:</span>
                <span
                  className={`font-bold ${
                    isUnlocked ? "text-emerald-400" : "text-brand-peach-vibrant"
                  }`}
                >
                  {isUnlocked ? "Unlocked & Ready" : "Locked"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-brand-cream/70">Server Visibility:</span>
                <span className="font-bold text-brand-peach">None (Zero-Knowledge)</span>
              </div>
            </div>

            {/* Quick action button */}
            <div className="mt-4 pt-3 border-t border-brand-violet-light">
              {isUnlocked ? (
                <button
                  type="button"
                  onClick={lockVault}
                  className="w-full py-2 bg-brand-violet border border-brand-peach text-brand-peach hover:bg-brand-brown hover:text-brand-cream text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Lock Vault Now
                </button>
              ) : isEnrolled === false ? (
                <button
                  type="button"
                  onClick={() => setShowSetupModal(true)}
                  className="w-full py-2 bg-brand-peach hover:bg-brand-peach-vibrant text-brand-violet text-xs font-bold uppercase tracking-wider border-2 border-brand-violet shadow-violet-dark-2 transition-all cursor-pointer"
                >
                  Setup Vault Key
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(true)}
                  className="w-full py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold uppercase tracking-wider border border-brand-peach-vibrant shadow-violet-dark-2 transition-all cursor-pointer"
                >
                  Enter Master Passphrase
                </button>
              )}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-brown" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Recently Added
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {filesError ? (
                <div className="text-center py-6 text-xs text-brand-violet/60">
                  Recent files are temporarily unavailable.
                </div>
              ) : rawFiles.slice(0, 4).map((file, idx) => (
                <div
                  key={file.id || idx}
                  className="flex items-start gap-2.5 p-2 bg-brand-cream-muted border border-brand-border text-xs"
                >
                  <div className="p-1 bg-brand-peach border border-brand-violet/30 text-brand-brown shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <div className="font-bold text-brand-violet truncate">
                      {file.name}
                    </div>
                    <div className="text-[10px] font-mono text-brand-violet/60 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatFileSize(file.size)}</span>
                      <span>·</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              {!filesError && rawFiles.length === 0 && (
                <div className="text-center py-6 text-xs text-brand-violet/60">
                  No uploads yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {mode === "preview" && modalFile && (
        <FilePreviewModal file={modalFile} onClose={closeModal} />
      )}
      {mode === "details" && modalFile && (
        <FileDetailsModal file={modalFile} onClose={closeModal} />
      )}
      {mode === "edit" && modalFile && (
        <FileEditModal file={modalFile} onClose={closeModal} />
      )}
      {mode === "move" && modalFile && (
        <FileMoveModal file={modalFile} onClose={closeModal} />
      )}

      {showAddFolder && (
        <AddFolderModal
          value={newFolderName}
          onChange={setNewFolderName}
          onAdd={handleCreateFolder}
          onClose={() => {
            if (!isCreatingFolder) {
              setNewFolderName("");
              setNewFolderColor(FOLDER_COLOR_OPTIONS[0].value);
              setNewFolderFavorite(false);
              setShowAddFolder(false);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleCreateFolder();
          }}
          isPending={isCreatingFolder}
          showFolderOptions
          color={newFolderColor}
          onColorChange={setNewFolderColor}
          isFavorite={newFolderFavorite}
          onFavoriteChange={setNewFolderFavorite}
        />
      )}

      {showUnlockModal && (
        <VaultUnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
        />
      )}

      {showSetupModal && (
        <VaultSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
        />
      )}
    </div>
  );
};

const DashboardPage = () => {
  return (
    <FileModalProvider>
      <DashboardContent />
    </FileModalProvider>
  );
};

export default DashboardPage;
