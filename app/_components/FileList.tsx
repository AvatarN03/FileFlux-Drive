"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  MoreVertical,
  Star,
  Pencil,
  FolderInput,
  Info,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  Video as VideoIcon,
  Lock,
} from "lucide-react";

import { FileItem } from "@/types/file";
import { formatFileSize } from "@/lib/file";
import { useFileModal } from "@/context/FileModalContext";
import { getFileCategoryFilter } from "@/lib/file/operations";
import { useFileMutations } from "@/hooks/useFileMutations";
import { useVault } from "@/context/VaultContext";
import { downloadAndDecryptFile } from "@/lib/storage/encryptedFileTransfer";
import { decryptMetadata } from "@/lib/crypto";
import { toastError, toastSuccess } from "@/lib/toast";
import FileModal from "./FileModal";

const CategoryIcon = ({ file }: { file: FileItem }) => {
  const category = getFileCategoryFilter(file);
  const iconProps = { size: 32, className: "text-brand-brown" };

  switch (category) {
    case "video":
      return <VideoIcon {...iconProps} />;
    case "spreadsheet":
      return <FileSpreadsheet {...iconProps} />;
    case "document":
      return <FileText {...iconProps} />;
    default:
      return <FileIcon {...iconProps} />;
  }
};

const FileList = ({ file }: { file: FileItem }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [displayName, setDisplayName] = useState(file.name);
  const [displayExt, setDisplayExt] = useState(file.extension);
  const menuRef = useRef<HTMLDivElement>(null);

  const { openModal } = useFileModal();
  const { remove } = useFileMutations();
  const { vaultKey } = useVault();

  useEffect(() => {
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
          setDisplayName(meta.name);
          setDisplayExt(meta.extension);
        })
        .catch((err) => {
          console.error("Failed to decrypt file metadata:", err);
        });
    } else if (file.isEncrypted && !vaultKey) {
      setDisplayName("[Encrypted File]");
      setDisplayExt("");
    } else {
      setDisplayName(file.name);
      setDisplayExt(file.extension);
    }
  }, [
    file.isEncrypted,
    file.encryptedMetadataCiphertext,
    file.encryptedMetadataNonce,
    file.name,
    file.extension,
    vaultKey,
  ]);

  const handleDelete = async () => {
    try {
      await remove.mutateAsync({ fileId: file.id });
      toastSuccess("File moved to trash");
      setShowDeleteConfirm(false);
    } catch {
      toastError("Failed to delete file");
    }
  };

  const handleDownload = async () => {
    if (file.isEncrypted) {
      if (!vaultKey) {
        toastError(
          "Please unlock your secure vault to decrypt and download this file."
        );
        return;
      }
      try {
        await downloadAndDecryptFile({ fileId: file.id, vaultKey });
        toastSuccess("File decrypted and downloaded successfully!");
      } catch (err: unknown) {
        console.error(err);
        toastError(
          (err as Error)?.message || "Failed to decrypt and download file"
        );
      }
    } else if (file.url) {
      window.open(file.url, "_blank");
    } else {
      toastError("No download URL available for this file");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuActions = [
    { label: "Preview", icon: Info, handler: () => openModal("preview", file) },
    { label: "Details", icon: Info, handler: () => openModal("details", file) },
    { label: "Edit", icon: Pencil, handler: () => openModal("edit", file) },
    { label: "Move", icon: FolderInput, handler: () => openModal("move", file) },
    { label: "Download", icon: Download, handler: handleDownload },
    {
      label: "Delete",
      icon: Trash2,
      handler: () => setShowDeleteConfirm(true),
      danger: true,
    },
  ];

  return (
    <div className="group relative bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-[2px_2px_0px_0px_#BA5624] p-2.5 transition-all flex flex-col justify-between">
      {/* Thumbnail area */}
      <div
        className="relative w-full aspect-square bg-brand-cream-muted border border-brand-border overflow-hidden mb-2.5 flex items-center justify-center cursor-pointer"
        onDoubleClick={() => openModal("preview", file)}
      >
        {file.thumbnailUrl ? (
          <Image
            src={file.thumbnailUrl}
            alt={file.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <CategoryIcon file={file} />
            {file.isEncrypted && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-brand-brown">
                <Lock className="w-2.5 h-2.5" />
                Zero-Knowledge
              </span>
            )}
          </div>
        )}

        {/* Favorite toggle badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label={file.isFavorite ? "Unfavorite" : "Favorite"}
          className={`absolute top-1.5 left-1.5 p-1 bg-brand-cream border border-brand-border shadow-[1px_1px_0px_0px_#381D2A] transition-opacity cursor-pointer ${
            file.isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Star
            size={13}
            className={
              file.isFavorite
                ? "fill-brand-peach-vibrant text-brand-peach-vibrant"
                : "text-brand-violet"
            }
          />
        </button>

        {/* Options menu button */}
        <div className="absolute top-1.5 right-1.5" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="File options"
            className="p-1 bg-brand-cream border border-brand-border shadow-[1px_1px_0px_0px_#381D2A] text-brand-violet opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
          >
            <MoreVertical size={13} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-brand-cream border-2 border-brand-violet shadow-[3px_3px_0px_0px_#BA5624] py-1 z-30">
              {menuActions.map(({ label, icon: Icon, handler, danger }) => (
                <button
                  key={label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    handler();
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-brand-violet hover:bg-brand-peach"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div>
        <p
          className="font-bold text-xs truncate text-brand-violet"
          title={displayName}
        >
          {displayName}
          {displayExt ? `.${displayExt}` : ""}
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono text-brand-violet/70 mt-1">
          <span>{displayExt ? displayExt.toUpperCase() : "FILE"}</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      </div>

      {showDeleteConfirm && (
        <FileModal
          title="Move to Trash"
          onClose={() => !remove.isPending && setShowDeleteConfirm(false)}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-brand-violet font-medium leading-relaxed">
              Are you sure you want to move{" "}
              <span className="font-bold text-brand-brown">
                {displayName}
                {displayExt ? `.${displayExt}` : ""}
              </span>{" "}
              to Trash?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={remove.isPending}
                className="px-3 py-1.5 text-xs font-bold text-brand-violet bg-brand-cream-muted border-2 border-brand-border hover:bg-brand-cream cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={remove.isPending}
                className="px-3 py-1.5 text-xs font-bold text-brand-cream bg-red-600 hover:bg-red-700 border-2 border-red-800 shadow-[2px_2px_0px_0px_#381D2A] cursor-pointer transition-colors"
              >
                {remove.isPending ? "Moving..." : "Move to Trash"}
              </button>
            </div>
          </div>
        </FileModal>
      )}
    </div>
  );
};

export default FileList;
