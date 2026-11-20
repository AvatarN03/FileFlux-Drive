"use client";

import { useState } from "react";
import { FileText, Download, Lock } from "lucide-react";
import { useFiles } from "@/hooks/useFileQueries";
import { useVault } from "@/context/VaultContext";
import { downloadAndDecryptFile } from "@/lib/storage/encryptedFileTransfer";
import { toastError, toastSuccess } from "@/lib/toast";
import { formatFileSize } from "@/lib/file";

interface FileGridProps {
  folderId: string | null;
}

const FileGrid = ({ folderId }: FileGridProps) => {
  const { data: files = [], isLoading, isError } = useFiles({ folderId });
  const { vaultKey } = useVault();
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  const handleDownload = async (fileId: string, isEncrypted: boolean, url?: string) => {
    if (!isEncrypted) {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else toastError("No download URL available for this file.");
      return;
    }

    if (!vaultKey) {
      toastError("Unlock your vault to decrypt and download this file.");
      return;
    }

    setDownloadingFileId(fileId);
    try {
      await downloadAndDecryptFile({ fileId, vaultKey });
      toastSuccess("File decrypted and downloaded successfully!");
    } catch (error) {
      toastError((error as Error)?.message || "Failed to decrypt and download file.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-brand-cream-muted border border-brand-border" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 border-2 border-red-500 text-red-800 text-xs font-bold">
        Failed to load folder files.
      </div>
    );
  }

  if (!files.length) {
    return (
      <div className="p-10 bg-brand-cream border-2 border-dashed border-brand-border shadow-brown-4 text-center">
        <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-violet-2">
          <FileText className="h-6 w-6 text-brand-brown" />
        </div>
        <h3 className="text-sm font-extrabold text-brand-violet mb-1">
          Folder is currently empty
        </h3>
        <p className="text-xs text-brand-violet/70">
          Upload encrypted documents into this folder to populate the workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-brand-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
          Folder Files ({files.length})
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-brown-2 p-4 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 bg-brand-cream-muted border border-brand-border flex items-center justify-center text-brand-brown shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-brand-peach px-2 py-0.5 border border-brand-border uppercase">
                {file.extension || (file.isEncrypted ? "LOCKED" : "FILE")}
              </span>
            </div>

            <div>
              <h3
                className="font-bold text-xs text-brand-violet truncate mb-1"
                title={file.extension ? `${file.name}.${file.extension}` : file.name}
              >
                {file.extension ? `${file.name}.${file.extension}` : file.name}
              </h3>
              <p className="text-[10px] font-mono text-brand-violet/60">
                {formatFileSize(file.size)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDownload(file.id, !!file.isEncrypted, file.url)}
              disabled={downloadingFileId === file.id}
              className="mt-3 inline-flex items-center justify-center gap-1.5 border border-brand-border bg-brand-cream-muted px-3 py-1.5 text-xs font-bold text-brand-violet transition-colors hover:bg-brand-peach disabled:cursor-wait disabled:opacity-50"
            >
              {file.isEncrypted && !vaultKey ? (
                <Lock className="h-3.5 w-3.5 text-brand-brown" />
              ) : (
                <Download className="h-3.5 w-3.5 text-brand-brown" />
              )}
              {downloadingFileId === file.id ? "Downloading…" : "Download"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
