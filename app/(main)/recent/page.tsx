"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Search, FileText, Download, Eye, Loader2 } from "lucide-react";
import { useFiles } from "@/hooks/useFileQueries";
import { useVault } from "@/context/VaultContext";
import { formatFileSize } from "@/lib/file";
import { FileItem } from "@/types/file";
import { decryptMetadata } from "@/lib/crypto";
import { downloadAndDecryptFile } from "@/lib/storage/encryptedFileTransfer";
import { toastSuccess, toastError } from "@/lib/toast";
import FilePreviewModal from "../../_components/FilePreviewModel";

const formatIndianDateTime = (dateVal?: string | Date | null) => {
  if (!dateVal) return "—";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" at ", ", ");
};

const RecentFileRow = ({
  file,
  onPreview,
}: {
  file: FileItem;
  onPreview: (file: FileItem) => void;
}) => {
  const { vaultKey } = useVault();
  const [decryptedName, setDecryptedName] = useState<string | null>(null);
  const [decryptedExt, setDecryptedExt] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (
      file.isEncrypted &&
      file.encryptedMetadataCiphertext &&
      file.encryptedMetadataNonce &&
      vaultKey
    ) {
      decryptMetadata(
        {
          nonce: file.encryptedMetadataNonce,
          ciphertext: file.encryptedMetadataCiphertext,
        },
        vaultKey
      )
        .then((meta) => {
          if (isMounted) {
            setDecryptedName(meta.name);
            setDecryptedExt(meta.extension);
          }
        })
        .catch((err) => {
          console.error("Failed to decrypt file metadata:", err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [
    file.isEncrypted,
    file.encryptedMetadataCiphertext,
    file.encryptedMetadataNonce,
    vaultKey,
  ]);

  const displayName = file.isEncrypted
    ? vaultKey
      ? decryptedName ?? "[Decrypting...]"
      : "[Encrypted File]"
    : file.name;

  const displayExt = file.isEncrypted
    ? vaultKey
      ? decryptedExt ?? ""
      : ""
    : file.extension;

  const handleDownload = async () => {
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
      } catch (err: unknown) {
        console.error(err);
        toastError(
          (err as Error)?.message || "Failed to decrypt and download file"
        );
      } finally {
        setIsDownloading(false);
      }
    } else if (file.url) {
      window.open(file.url, "_blank");
    } else {
      toastError("No download URL available for this file");
    }
  };

  return (
    <div className="grid grid-cols-12 items-center py-3 px-4 hover:bg-brand-cream-muted/50 transition-colors text-xs font-medium">
      <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 truncate pr-2">
        <div className="w-8 h-8 bg-brand-cream-muted border border-brand-border flex items-center justify-center text-brand-brown shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="truncate">
          <div className="font-bold text-brand-violet truncate">
            {displayName}
            {displayExt ? `.${displayExt}` : ""}
          </div>
          <span className="text-[10px] font-mono uppercase text-brand-violet/60">
            {displayExt || file.extension || "FILE"}
          </span>
        </div>
      </div>

      <div className="hidden sm:block sm:col-span-3 text-[11px] font-mono text-brand-violet/70">
        {formatIndianDateTime(file.updatedAt || file.createdAt)}
      </div>

      <div className="col-span-3 sm:col-span-2 text-right text-[11px] font-mono text-brand-violet/80">
        {formatFileSize(file.size)}
      </div>

      <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() =>
            onPreview({
              ...file,
              name: displayName,
              extension: displayExt,
            })
          }
          title="Preview"
          className="p-1.5 bg-brand-cream-muted border border-brand-border hover:bg-brand-peach text-brand-violet transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download"
          className="p-1.5 bg-brand-brown text-brand-cream hover:bg-brand-brown-dark transition-colors cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

const RecentPage = () => {
  const { data: rawFiles = [], isLoading } = useFiles({ folderId: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week">("all");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const filteredFiles = useMemo(() => {
    const currentTime = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    return rawFiles.filter((file) => {
      const itemTimestamp = new Date(file.updatedAt || file.createdAt).getTime();

      if (timeFilter === "today" && currentTime - itemTimestamp > oneDayMs) {
        return false;
      }
      if (timeFilter === "week" && currentTime - itemTimestamp > oneWeekMs) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nameMatch = (file.name || "").toLowerCase().includes(q);
        const extMatch = (file.extension || "").toLowerCase().includes(q);
        if (!nameMatch && !extMatch) {
          return false;
        }
      }

      return true;
    });
  }, [rawFiles, timeFilter, searchTerm]);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Clock className="w-3 h-3 text-brand-brown" />
            Chronological Activity Stream
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Recent Files
          </h1>
          <p className="text-xs text-brand-violet/75">
            Quickly locate assets you have uploaded, edited, or inspected recently.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-cream-muted border-2 border-brand-border p-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTimeFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              timeFilter === "all"
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
            }`}
          >
            All Activity
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("today")}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              timeFilter === "today"
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("week")}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              timeFilter === "week"
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
            }`}
          >
            This Week
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-3 text-brand-brown" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter recent files..."
            className="w-full pl-8 pr-3 py-1.5 bg-brand-cream border-2 border-brand-border text-xs font-semibold placeholder:text-brand-violet/40 focus:outline-none focus:border-brand-brown"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-brand-violet/60 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-8">
          Loading recent files from encrypted storage...
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-8">
          <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#381D2A]">
            <Clock className="w-6 h-6 text-brand-brown" />
          </div>
          <h3 className="text-sm font-bold text-brand-violet">No recent files found</h3>
          <p className="text-xs text-brand-violet/60 mt-1 max-w-sm">
            {searchTerm
              ? "No files matched your search or time filter. Try clearing the filter."
              : "Files you upload to your encrypted workspace will automatically appear here."}
          </p>
          <Link
            href="/dashboard"
            className="mt-4 px-4 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] overflow-hidden">
          <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-brand-violet bg-brand-cream-muted border-b-2 border-brand-border py-2.5 px-4">
            <span className="col-span-6 sm:col-span-5">File Name</span>
            <span className="hidden sm:block sm:col-span-3">Last Modified</span>
            <span className="col-span-3 sm:col-span-2 text-right">Size</span>
            <span className="col-span-3 sm:col-span-2 text-right">Actions</span>
          </div>

          <div className="divide-y divide-brand-border/60">
            {filteredFiles.map((file) => (
              <RecentFileRow
                key={file.id}
                file={file}
                onPreview={(f) => setPreviewFile(f)}
              />
            ))}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default RecentPage;
