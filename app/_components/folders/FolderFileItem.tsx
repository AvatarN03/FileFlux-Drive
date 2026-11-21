"use client";

import { useState } from "react";

import { Download, FileText, Lock } from "lucide-react";

import { useVault } from "@/context/VaultContext";

import { TableCell, TableRow } from "@/components/ui/table";

import { formatFileSize } from "@/lib/file";
import { downloadAndDecryptFile } from "@/lib/storage/encryptedFileTransfer";
import { toastError, toastSuccess } from "@/lib/toast";

import type { FileItem } from "@/types/file";

interface FolderFileItemProps {
  file: FileItem;
  viewMode?: "list" | "grid";
}

const FolderFileItem = ({ file, viewMode = "list" }: FolderFileItemProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { vaultKey } = useVault();
  const displayName = file.extension ? `${file.name}.${file.extension}` : file.name;
  const isGridView = viewMode === "grid";

  const handleDownload = async () => {
    if (!file.isEncrypted) {
      if (file.url) window.open(file.url, "_blank", "noopener,noreferrer");
      else toastError("No download URL available for this file.");
      return;
    }

    if (!vaultKey) {
      toastError("Unlock your vault to decrypt and download this file.");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadAndDecryptFile({ fileId: file.id, vaultKey });
      toastSuccess("File decrypted and downloaded successfully!");
    } catch (error) {
      toastError((error as Error)?.message || "Failed to decrypt and download file.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TableRow
      className={
        isGridView
          ? "flex min-w-0 flex-col border-2 border-brand-border bg-brand-cream p-4 shadow-brown-2 hover:border-brand-brown hover:bg-brand-cream"
          : "border-brand-border bg-brand-cream hover:bg-brand-cream-muted"
      }
    >
      <TableCell
        className={
          isGridView
            ? "block min-w-0 px-0 py-0"
            : "min-w-[16rem] px-3 py-3 sm:px-4"
        }
      >
        <div className="flex min-w-0 items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-violet/40 bg-brand-cream-muted text-brand-brown">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-brand-violet" title={displayName}>
              {displayName}
            </p>
            <p className="mt-0.5 text-[10px] font-mono uppercase text-brand-violet/60">
              {file.extension || (file.isEncrypted ? "Locked" : "File")}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell
        className={
          isGridView
            ? "block px-0 py-2 text-xs font-mono text-brand-violet/70"
            : "whitespace-nowrap px-3 py-3 text-xs font-mono text-brand-violet/70 sm:px-4"
        }
      >
        {formatFileSize(file.size)}
      </TableCell>
      <TableCell
        className={
          isGridView
            ? "block px-0 pt-3"
            : "w-0 px-3 py-3 text-right sm:px-4"
        }
      >
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label={`Download ${displayName}`}
          className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap border border-brand-border bg-brand-cream-muted px-3 py-1.5 text-xs font-bold text-brand-violet transition-colors hover:bg-brand-peach disabled:cursor-wait disabled:opacity-50 ${
            isGridView ? "w-full" : ""
          }`}
        >
          {file.isEncrypted && !vaultKey ? (
            <Lock className="h-3.5 w-3.5 text-brand-brown" />
          ) : (
            <Download className="h-3.5 w-3.5 text-brand-brown" />
          )}
          {isDownloading ? "Downloading…" : "Download"}
        </button>
      </TableCell>
    </TableRow>
  );
};

export default FolderFileItem;
