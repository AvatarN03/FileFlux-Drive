
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
  const menuRef = useRef<HTMLDivElement>(null);

  const { openModal } = useFileModal();

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
      handler: () => console.log("delete", file.id),
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
    </div>
  );
};

export default FileList;