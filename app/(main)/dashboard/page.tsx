"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HardDrive,
  FolderTree,
  FileText,
  ShieldCheck,
  Plus,
  ArrowRight,
  Search,
  Sparkles,
  Lock,
  Unlock,
  FolderPlus,
  Activity,
  Zap,
  FileSpreadsheet,
  File as FileIcon,
  Video as VideoIcon,
  UploadCloud,
  CheckCircle2,
  Clock,
} from "lucide-react";

import FileUpload from "../../_components/FileUpload";
import FileList from "../../_components/FileList";
import FilePreviewModal from "../../_components/FilePreviewModel";
import FileDetailsModal from "../../_components/FileDetailModel";
import FileEditModal from "../../_components/FileEditModel";
import AddFolderModal from "../../_components/folders/AddFolderModal";
import VaultUnlockModal from "../../_components/vault/VaultUnlockModal";
import VaultSetupModal from "../../_components/vault/VaultSetupModal";

import { useAuth } from "@/hooks/useAuth";
import { useVault } from "@/context/VaultContext";
import { useFiles } from "@/hooks/useFileQueries";
import { useFoldersAll } from "@/hooks/useFolderQueries";
import { useFolderCreate } from "@/hooks/useFolderMutations";
import { FileModalProvider, useFileModal } from "@/context/FileModalContext";
import { formatFileSize } from "@/lib/file";
import { getFileCategoryFilter } from "@/lib/file/operations";
import { FileItem } from "@/types/file";
import toastC from "@/lib/toast";

type CategoryFilter = "all" | "document" | "image" | "video" | "spreadsheet";

const DashboardContent = () => {
  const { user } = useAuth();
  const { isEnrolled, isUnlocked, lockVault } = useVault();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Queries
  const { data: rawFiles = [], isLoading: filesLoading } = useFiles({
    folderId: null,
  });
  const { data: folders = [], isLoading: foldersLoading } = useFoldersAll(null);
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
    let images = 0;
    let videos = 0;
    let sheets = 0;
    let other = 0;

    let docBytes = 0;
    let imgBytes = 0;
    let vidBytes = 0;
    let sheetBytes = 0;
    let otherBytes = 0;

    rawFiles.forEach((f) => {
      const cat = getFileCategoryFilter(f);
      if (cat === "document") {
        docs++;
        docBytes += f.size;
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
      images,
      videos,
      sheets,
      other,
      docBytes,
      imgBytes,
      vidBytes,
      sheetBytes,
      otherBytes,
    };
  }, [rawFiles]);

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
      { name: trimmed, parentId: null },
      {
        onSuccess: () => {
          setNewFolderName("");
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
      {/* Top Banner / System Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-violet text-brand-peach text-[11px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-brand-peach-vibrant inline-block animate-pulse" />
            fileflux://vault/active · Zero-Knowledge Storage
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-violet tracking-tight">
            Encrypted Workspace Console
          </h1>
          <p className="text-xs text-brand-violet/75 font-medium max-w-xl">
            Client-side libsodium authenticated encryption is active. Your keys
            never leave your browser, ensuring complete privacy.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isEnrolled === false && (
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-peach text-brand-violet font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] hover:bg-brand-peach-vibrant transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-brand-brown" />
              Setup Vault Key
            </button>
          )}

          {isEnrolled === true && (
            <button
              type="button"
              onClick={() => (isUnlocked ? lockVault() : setShowUnlockModal(true))}
              className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer ${
                isUnlocked
                  ? "bg-emerald-600/15 text-emerald-800 border-emerald-700"
                  : "bg-brand-brown text-brand-cream hover:bg-brand-brown-dark"
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-700" />
                  Vault Unlocked (Click to Lock)
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-brand-peach" />
                  Unlock Vault
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddFolder(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-cream-muted text-brand-violet hover:bg-brand-peach font-bold text-xs border-2 border-brand-violet shadow-[2px_2px_0px_0px_#BA5624] transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-brand-brown" />
            + New Folder
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Storage Capacity */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-4 flex flex-col justify-between">
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
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-4 flex flex-col justify-between">
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
              Zero-knowledge encrypted items
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
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-4 flex flex-col justify-between">
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
              Root organization units
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
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-4 flex flex-col justify-between">
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
              Argon2id + XChaCha20-Poly1305
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Client-side Verified
          </div>
        </div>
      </div>

      {/* Storage Category Distribution Bar */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-brown" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Storage Distribution by Asset Type
            </h2>
          </div>
          <span className="text-[11px] font-mono text-brand-violet/70">
            {formatFileSize(remainingBytes)} free of {formatFileSize(storageLimit)}
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="w-full bg-brand-cream-muted border-2 border-brand-violet h-4 flex overflow-hidden mb-3">
          {categoryStats.docs > 0 && (
            <div
              title={`Documents: ${categoryStats.docs} files (${formatFileSize(categoryStats.docBytes)})`}
              style={{
                width: `${Math.max(4, (categoryStats.docBytes / (storageLimit || 1)) * 100)}%`,
              }}
              className="bg-brand-brown h-full border-r border-brand-cream"
            />
          )}
          {categoryStats.images > 0 && (
            <div
              title={`Images: ${categoryStats.images} files (${formatFileSize(categoryStats.imgBytes)})`}
              style={{
                width: `${Math.max(4, (categoryStats.imgBytes / (storageLimit || 1)) * 100)}%`,
              }}
              className="bg-brand-peach-vibrant h-full border-r border-brand-cream"
            />
          )}
          {categoryStats.sheets > 0 && (
            <div
              title={`Spreadsheets: ${categoryStats.sheets} files (${formatFileSize(categoryStats.sheetBytes)})`}
              style={{
                width: `${Math.max(4, (categoryStats.sheetBytes / (storageLimit || 1)) * 100)}%`,
              }}
              className="bg-emerald-600 h-full border-r border-brand-cream"
            />
          )}
          {categoryStats.videos > 0 && (
            <div
              title={`Media: ${categoryStats.videos} files (${formatFileSize(categoryStats.vidBytes)})`}
              style={{
                width: `${Math.max(4, (categoryStats.vidBytes / (storageLimit || 1)) * 100)}%`,
              }}
              className="bg-brand-violet h-full border-r border-brand-cream"
            />
          )}
          {categoryStats.other > 0 && (
            <div
              title={`Other: ${categoryStats.other} files (${formatFileSize(categoryStats.otherBytes)})`}
              style={{
                width: `${Math.max(4, (categoryStats.otherBytes / (storageLimit || 1)) * 100)}%`,
              }}
              className="bg-brand-violet-light h-full"
            />
          )}
        </div>

        {/* Category Legend Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2 p-2 bg-brand-cream-muted border border-brand-border">
            <span className="w-2.5 h-2.5 bg-brand-brown inline-block shrink-0" />
            <div className="truncate">
              <span className="font-bold">Docs:</span> {categoryStats.docs}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-cream-muted border border-brand-border">
            <span className="w-2.5 h-2.5 bg-brand-peach-vibrant inline-block shrink-0" />
            <div className="truncate">
              <span className="font-bold">Images:</span> {categoryStats.images}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-cream-muted border border-brand-border">
            <span className="w-2.5 h-2.5 bg-emerald-600 inline-block shrink-0" />
            <div className="truncate">
              <span className="font-bold">Sheets:</span> {categoryStats.sheets}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-cream-muted border border-brand-border">
            <span className="w-2.5 h-2.5 bg-brand-violet inline-block shrink-0" />
            <div className="truncate">
              <span className="font-bold">Media:</span> {categoryStats.videos}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-cream-muted border border-brand-border col-span-2 sm:col-span-1">
            <span className="w-2.5 h-2.5 bg-brand-violet-light inline-block shrink-0" />
            <div className="truncate">
              <span className="font-bold">Other:</span> {categoryStats.other}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Left 8 Cols (Folders & Recent Files) + Right 4 Cols (Upload & Services) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Workspaces & Recent Files (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Folders Strip */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-brand-border">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-brand-brown" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Workspace Folders
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFolder(true)}
                  className="text-xs font-bold text-brand-brown hover:text-brand-brown-dark flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Folder
                </button>
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
            ) : folders.length === 0 ? (
              <div className="p-6 bg-brand-cream-muted border-2 border-dashed border-brand-border text-center">
                <p className="text-xs font-bold text-brand-violet mb-2">
                  No folders created yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddFolder(true)}
                  className="px-3 py-1.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] cursor-pointer transition-all"
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
                    className="flex items-center gap-3 p-3 bg-brand-cream-muted border-2 border-brand-border hover:border-brand-brown hover:bg-brand-cream shadow-[2px_2px_0px_0px_#BA5624] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    <div className="w-8 h-8 bg-brand-peach border border-brand-violet/40 flex items-center justify-center shrink-0">
                      <FolderTree className="w-4 h-4 text-brand-brown" />
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-bold text-brand-violet truncate">
                        {folder.name}
                      </h3>
                      <p className="text-[10px] font-mono text-brand-violet/60">
                        Folder workspace
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Files Table / Grid */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
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
                      ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
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
            ) : filteredFiles.length === 0 ? (
              <div className="py-12 px-4 text-center bg-brand-cream-muted border-2 border-dashed border-brand-border">
                <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#381D2A]">
                  <UploadCloud className="w-6 h-6 text-brand-brown" />
                </div>
                <h3 className="text-sm font-extrabold text-brand-violet mb-1">
                  No files match your query
                </h3>
                <p className="text-xs text-brand-violet/70 max-w-sm mx-auto mb-4 font-medium">
                  Upload an encrypted file using the ingestion portal on the
                  right to populate your workspace.
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

        {/* Right Side: Upload Box & Activity Stream (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* File Upload Zone */}
          <div className="space-y-2">
            <FileUpload />
          </div>

          {/* Personal Vault State Insight Card */}
          <div className="bg-brand-violet-dark text-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-violet-light">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-peach" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cream">
                  Cryptographic Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-brand-brown text-brand-cream px-2 py-0.5 border border-brand-peach-vibrant/40 font-bold">
                XChaCha20
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
                  {isUnlocked ? "Unlocked & Ready" : "Locked (Passphrase Req)"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-brand-violet-light/50">
                <span className="text-brand-cream/70">Key Derivation:</span>
                <span className="font-mono text-brand-peach">Argon2id (SUMO)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-brand-cream/70">Server Visibility:</span>
                <span className="font-bold text-brand-peach">0% (Zero Metadata)</span>
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
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(true)}
                  className="w-full py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold uppercase tracking-wider border border-brand-peach-vibrant shadow-[2px_2px_0px_0px_#26131D] transition-all cursor-pointer"
                >
                  Enter Master Passphrase
                </button>
              )}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-brown" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Recent Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-brand-cream-muted px-2 py-0.5 border border-brand-border text-brand-violet/70">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {rawFiles.slice(0, 4).map((file, idx) => (
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

              {rawFiles.length === 0 && (
                <div className="text-center py-6 text-xs text-brand-violet/60">
                  No activity events recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Storage Quota Card */}
          <div className="bg-brand-peach border-2 border-brand-violet shadow-[4px_4px_0px_0px_#381D2A] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-brown" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-violet">
                Upgrade Storage Plan
              </h3>
            </div>
            <p className="text-xs text-brand-violet/85 font-medium mb-4 leading-relaxed">
              Need more encrypted capacity? Expand to 500 MB with FileFlux Pro,
              including granular sharing and team vaults.
            </p>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold uppercase tracking-wider border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] transition-all"
            >
              View Available Plans
              <ArrowRight className="w-3.5 h-3.5 text-brand-peach" />
            </Link>
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

      {showAddFolder && (
        <AddFolderModal
          value={newFolderName}
          onChange={setNewFolderName}
          onAdd={handleCreateFolder}
          onClose={() => {
            if (!isCreatingFolder) {
              setNewFolderName("");
              setShowAddFolder(false);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleCreateFolder();
          }}
          isPending={isCreatingFolder}
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
