import { Edit, X } from "lucide-react";
import { formatFileSize, getFileExtension } from "@/lib/file/fileFunctions";
import { FilePreviewProps } from "@/types/ui";

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
}: FilePreviewProps) => {
  const extension = getFileExtension(file);

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
              <p className="truncate font-medium" title={fileName + extension}>
                {fileName}
                {extension}
              </p>
            </div>
          )}

          {!isUploading && !uploadComplete && (
            <div className="flex justify-end gap-2 items-center w-full">
              <button
                type="button"
                className="hover:bg-ember group rounded-full cursor-pointer p-2 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEdit();
                }}
                aria-label="Edit filename"
              >
                <Edit size={20} className="group-hover:text-peach" />
              </button>

              <button
                type="button"
                className="hover:bg-ember group rounded-full p-2 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                aria-label="Remove file"
              >
                <X size={20} className="text-red-500 group-hover:text-peach" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs mt-2 text-violet">
          {file.type || "Unknown type"} · {formatFileSize(file.size)}
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

          <button
            type="button"
            disabled={isUploading}
            onClick={(e) => {
              e.stopPropagation();
              onUpload();
            }}
            className="w-full bg-ember disabled:opacity-65 disabled:cursor-not-allowed hover:text-peach font-semibold text-brown cursor-pointer rounded-md py-3 shadow-md transition"
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : "Upload"}
          </button>
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