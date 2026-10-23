
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
} from "lucide-react";

import { FileItem } from "@/types/file";
import { formatFileSize} from "@/lib/file";
import { useFileModal } from "@/context/FileModalContext";
import { getFileCategoryFilter } from "@/lib/file/operations";
import { useFileMutations } from "@/hooks/useFileMutations";
import { toastError, toastSuccess } from "@/lib/toast";
import FileModal from "./FileModal";


const CategoryIcon = ({ file }: { file: FileItem }) => {
  const category = getFileCategoryFilter(file);
  const iconProps = { size: 36, className: "text-violet" };

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
  const menuRef = useRef<HTMLDivElement>(null);

  const { openModal } = useFileModal();
  const { remove } = useFileMutations();

  const handleDelete = async () => {
    try {
      await remove.mutateAsync({ fileId: file.id });
      toastSuccess("File moved to trash");
      setShowDeleteConfirm(false);
    } catch {
      toastError("Failed to delete file");
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
    { label: "Edit", icon: Pencil, handler: () => openModal("edit", file) },
    { label: "Details", icon: Info, handler: () => openModal("details", file) },
    { label: "Move", icon: FolderInput, handler: () => openModal("move", file) },
    { label: "Download", icon: Download, handler: () => console.log("download", file.id) },
    {
      label: "Delete",
      icon: Trash2,
      handler: () => setShowDeleteConfirm(true),
      danger: true,
    },
  ];

  return (
    <div className="group relative bg-brown rounded-lg p-2 border border-brown/30 hover:border-ember hover:shadow-md transition-all">
      {/* Thumbnail */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-brown/10 mb-3"
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
          <div className="w-full h-full flex items-center justify-center">
            <CategoryIcon file={file} />
          </div>
        )}

        {/* Favorite toggle - top left, always visible if favorited */}
        <button
          type="button"
           onClick={(e) => {
            e.stopPropagation();
            console.log("toggle favorite", file.id);
          }}
          aria-label={file.isFavorite ? "Unfavorite" : "Favorite"}
          className={`absolute top-2 left-2 p-1.5 rounded-full bg-brown/60 backdrop-blur-sm transition-opacity
            ${file.isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <Star
            size={16}
            className={file.isFavorite ? "fill-ember text-ember" : "text-peach"}
          />
        </button>

        {/* Options menu - top right */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="File options"
            className="p-1.5 rounded-full bg-brown/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} className="text-peach" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-peach rounded-md shadow-lg border border-brown/20 py-1 z-30">
              {menuActions.map(({ label, icon: Icon, handler, danger }) => (
                <button
                  key={label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    handler();
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-brown transition-colors
                    ${danger ? "text-red-500" : "text-violet"}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <p className="font-medium text-sm truncate text-violet" title={file.name}>
        {file.name}.{file.extension}
      </p>
      <p className="text-xs text-violet/60 mt-0.5">
        {file.extension.toUpperCase()} · {formatFileSize(file.size)}
      </p>

      {showDeleteConfirm && (
        <FileModal
          title="Move to Trash"
          onClose={() => !remove.isPending && setShowDeleteConfirm(false)}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-violet/80">
              Are you sure you want to move{" "}
              <span className="font-semibold text-violet">
                {file.name}.{file.extension}
              </span>{" "}
              to Trash?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={remove.isPending}
                className="px-4 py-2 text-sm font-medium text-violet/70 hover:text-violet bg-brown/10 hover:bg-brown/20 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={remove.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
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