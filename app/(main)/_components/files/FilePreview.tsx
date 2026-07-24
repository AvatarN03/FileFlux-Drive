/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo } from "react";
import { Edit, X, FileText, FileSpreadsheet, File as FileIcon } from "lucide-react";


import { FilePreviewProps } from "@/types/ui";
import { formatFileSize, getFileExtension } from "@/lib/file";
import { getDisplayFileType } from "@/constant";

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

  // Derived value — compute during render, not via setState-in-effect.
  const previewUrl = useMemo(() => {
    if (category !== "image" && category !== "video") return null;
    return URL.createObjectURL(file);
  }, [file, category]);

  // Effect is only here to clean up the external resource (the blob URL),
  // not to compute/set state.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);


  return (
    <div className="space-y-4 w-full">
      <div className="p-2 rounded-lg bg-brown">
        <div className="flex items-center gap-2 flex-col bg-peach p-2 rounded-md">
          {isEditingFileName ? (
            <input
              autoFocus
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onToggleEdit();
                if (e.key === "Escape") onToggleEdit();
              }}
              className="flex-1 border border-b-2 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-ember"
              onBlur={onToggleEdit}
              disabled={isUploading}
            />
          ) : (
            <div className="w-full">
              <p className="truncate font-medium" title={displayFileName}>
                {displayFileName}
              </p>
            </div>
          )}

          <div className="relative w-full h-fit max-h-45 overflow-hidden flex justify-center items-center bg-brown rounded-md p-1">
            {/* Preview area, branched by category */}
            {category === "image" && previewUrl && (

              <img
                src={previewUrl}
                alt={file.name}
                className="object-cover rounded-md"
              />
            )}

            {category === "video" && previewUrl && (
              <video
                src={previewUrl}
                className=" object-cover rounded-md"
                muted
                playsInline
                preload="metadata"
              />
            )}

            {category === "pdf" && (
              <FileText size={40} className="text-violet" />
            )}

            {category === "doc" && (
              <FileText size={40} className="text-violet" />
            )}

            {category === "sheet" && (
              <FileSpreadsheet size={40} className="text-violet" />
            )}

            {category === "other" && (
              <FileIcon size={40} className="text-violet" />
            )}
          </div>

          {!isUploading && !uploadComplete && (
            <div className="flex justify-around gap-2 items-center w-full">
              <button
                type="button"
                className="hover:bg-ember group rounded-sm cursor-pointer p-2 transition bg-amber-500 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEdit();
                }}
                aria-label="Edit filename"
              >
                <Edit size={20} className="group-hover:text-peach" />
                Edit
              </button>

              <button
                type="button"
                className="hover:bg-ember group rounded-sm p-2 transition cursor-pointer bg-ember/30 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                aria-label="Remove file"
              >
                <X size={20} className="text-red-500 group-hover:text-peach" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <p
          className="text-xs mt-2 text-violet text-ellipsis w-full line-clamp-2"
          title={file.type}
        >
          {getDisplayFileType(extension)} · {formatFileSize(file.size)}
        </p>
      </div>

      {!uploadComplete && (
        <>
          <div className="h-2 bg-brown rounded overflow-hidden">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-full bg-ember transition-all duration-300"
            />
          </div>

          {isUploading ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCancelUpload();
              }}
              className="w-full bg-red-500 hover:bg-red-600 font-semibold text-peach cursor-pointer rounded-md py-3 shadow-md transition"
            >
              Cancel Upload ({uploadProgress}%)
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpload();
              }}
              className="w-full bg-ember hover:text-peach font-semibold text-brown cursor-pointer rounded-md py-3 shadow-md transition"
            >
              Upload
            </button>
          )}
        </>
      )}

      {uploadComplete && (
        <div className="text-center text-green-600 font-semibold py-3">
          Upload Complete! ✓
        </div>
      )}
    </div>
  );
};

export default FilePreview;