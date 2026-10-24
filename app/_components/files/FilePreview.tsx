/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { Edit, X, FileText, FileSpreadsheet, File as FileIcon } from "lucide-react";

import { FilePreviewProps } from "@/types/ui";
import { formatFileSize } from "@/lib/file";
import { getFileExtension } from "@/lib/file/operations";
import { FileType } from "@/constant";

type FileCategory = "image" | "video" | "pdf" | "doc" | "sheet" | "other";

const getFileCategory = (file: File, extension: string): FileCategory => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";

  const ext = extension.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  return "other";
};

const getDisplayFileType = (ext: string): string => {
  const normalized = ext.toLowerCase();
  if (normalized in FileType) {
    return FileType[normalized as keyof typeof FileType];
  }
  return "File";
};

const FilePreview = ({
  file,
  fileName,
  isEditingFileName,
  isUploading,
  uploadProgress,
  uploadComplete,
  onFileNameChange,
  onToggleEdit,
  onReset,
  onUpload,
  onCancelUpload,
}: FilePreviewProps) => {
  const extension = getFileExtension(file.name);
  const displayFileName = extension ? `${fileName}.${extension}` : fileName;

  const category = useMemo(
    () => getFileCategory(file, extension),
    [file, extension]
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (category !== "image" && category !== "video") return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, category]);

  return (
    <div className="space-y-3 w-full text-brand-violet">
      <div className="p-3 bg-brand-cream-muted border-2 border-brand-border">
        <div className="flex items-center gap-2 flex-col">
          {isEditingFileName ? (
            <input
              autoFocus
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-2.5 py-1.5 bg-brand-cream border-2 border-brand-brown text-brand-violet text-xs font-bold focus:outline-none"
              onBlur={onToggleEdit}
              disabled={isUploading}
            />
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <p className="truncate font-bold text-xs text-brand-violet" title={displayFileName}>
                {displayFileName}
              </p>
              {!isUploading && !uploadComplete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleEdit();
                  }}
                  className="p-1 hover:bg-brand-cream text-brand-brown transition-colors cursor-pointer"
                  title="Rename"
                >
                  <Edit size={14} />
                </button>
              )}
            </div>
          )}

          <div className="relative w-full min-h-24 max-h-36 overflow-hidden flex justify-center items-center bg-brand-cream border border-brand-border p-2 mt-1">
            {category === "image" && previewUrl && (
              <img
                src={previewUrl}
                alt={file.name}
                className="max-h-32 object-contain"
              />
            )}

            {category === "video" && previewUrl && (
              <video
                src={previewUrl}
                className="max-h-32 object-contain"
                muted
                playsInline
                preload="metadata"
              />
            )}

            {category === "pdf" && (
              <FileText size={36} className="text-brand-brown" />
            )}

            {category === "doc" && (
              <FileText size={36} className="text-brand-brown" />
            )}

            {category === "sheet" && (
              <FileSpreadsheet size={36} className="text-brand-brown" />
            )}

            {category === "other" && (
              <FileIcon size={36} className="text-brand-brown" />
            )}
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-mono text-brand-violet/70 mt-1">
            <span>{getDisplayFileType(extension)}</span>
            <span>{formatFileSize(file.size)}</span>
          </div>

          {!isUploading && !uploadComplete && (
            <div className="flex justify-end gap-2 w-full mt-2">
              <button
                type="button"
                className="px-3 py-1 bg-brand-cream text-brand-violet hover:bg-brand-peach border border-brand-border text-xs font-bold transition cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {!uploadComplete && (
        <>
          {isUploading && (
            <div className="h-2 bg-brand-cream-muted border border-brand-border overflow-hidden">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="h-full bg-brand-peach-vibrant transition-all duration-200"
              />
            </div>
          )}

          {isUploading ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCancelUpload();
              }}
              className="w-full bg-red-600 hover:bg-red-700 font-bold text-brand-cream cursor-pointer text-xs py-2.5 border-2 border-red-800 shadow-[2px_2px_0px_0px_#381D2A] transition-all"
            >
              Cancel Encryption ({uploadProgress}%)
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpload();
              }}
              className="w-full bg-brand-brown hover:bg-brand-brown-dark font-bold text-brand-cream cursor-pointer text-xs py-2.5 border-2 border-brand-brown shadow-[3px_3px_0px_0px_#381D2A] hover:shadow-[1px_1px_0px_0px_#381D2A] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              Encrypt & Store File
            </button>
          )}
        </>
      )}

      {uploadComplete && (
        <div className="text-center bg-emerald-600/15 border-2 border-emerald-700 text-emerald-900 font-bold text-xs py-2">
          File Encrypted & Stored Successfully ✓
        </div>
      )}
    </div>
  );
};

export default FilePreview;
