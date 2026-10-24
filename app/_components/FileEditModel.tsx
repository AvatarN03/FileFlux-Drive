"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { FileItem } from "@/types/file";
import { toastError } from "@/lib/toast";
import FileModal from "./FileModal";
import { useFileMutations } from "@/hooks/useFileMutations";

const FileEditModal = ({ file, onClose }: { file: FileItem; onClose: () => void }) => {
  const [name, setName] = useState(file.name);
  const [extension, setExtension] = useState(file.extension);
  const [isFavorite, setIsFavorite] = useState(file.isFavorite);

  const {update} = useFileMutations();

  const hasChanges =
    name.trim() !== file.name ||
    extension.trim().toLowerCase() !== file.extension.toLowerCase() ||
    isFavorite !== file.isFavorite;

  const extensionChanged =
    extension.trim().toLowerCase() !== file.extension.toLowerCase();

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedExtension = extension.trim().toLowerCase().replace(/^\./, "");

    if (!trimmedName) {
      toastError("Filename cannot be empty");
      return;
    }

    if (!trimmedExtension) {
      toastError("Extension cannot be empty");
      return;
    }

    try {
      await update.mutateAsync({
        fileId: file.id,
        name: trimmedName,
        extension: trimmedExtension,
        isFavorite,
      });
      onClose();
    } catch {
      toastError("Failed to update file");
    }
  };

  return (
    <FileModal title="Edit File" onClose={onClose} maxWidth="max-w-sm">
      <div className="space-y-4">
        {/* Name + extension */}
        <div>
          <label className="text-xs text-violet/60 mb-1 block">Name</label>
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              disabled={update.isPending}
              className="flex-1 border border-brown/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ember"
            />
            <span className="text-violet/50">.</span>
            <input
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              disabled={update.isPending}
              className="w-16 border border-brown/30 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          {extensionChanged && (
            <p className="text-xs text-amber-600 mt-1">
              Changing the extension won&apos;t convert the file — make sure it still matches the actual file type.
            </p>
          )}
        </div>

        {/* Read-only type info */}
        <div>
          <label className="text-xs text-violet/60 mb-1 block">File type</label>
          <p className="text-sm text-violet/70 bg-brown/5 rounded-md px-3 py-2">
            {file.mimeType}
          </p>
        </div>

        {/* Favorite toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-violet">Favorite</span>
          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            disabled={update.isPending}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Unfavorite" : "Favorite"}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? "bg-ember/20" : "bg-brown/10"
            }`}
          >
            <Star
              size={18}
              className={isFavorite ? "fill-ember text-ember" : "text-violet/50"}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={update.isPending || !hasChanges}
          className="w-full bg-ember disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-brown rounded-md py-2.5 transition"
        >
          {update.isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </FileModal>
  );
};

export default FileEditModal;