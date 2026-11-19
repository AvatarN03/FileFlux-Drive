"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import type { FileItem, UpdateFilePayload } from "@/types/file";
import { toastError } from "@/lib/toast";
import { useFileMutations } from "@/hooks/useFileMutations";
import FileModal from "./FileModal";

type FileEditModalProps = {
  file: FileItem;
  onClose: () => void;
};

const FileEditModal = ({ file, onClose }: FileEditModalProps) => {
  const [name, setName] = useState(file.name);
  const [extension, setExtension] = useState(file.extension);
  const [isFavorite, setIsFavorite] = useState(file.isFavorite);
  const { update } = useFileMutations();

  const hasChanges = file.isEncrypted
    ? isFavorite !== file.isFavorite
    : name.trim() !== file.name ||
      extension.trim().toLowerCase() !== file.extension.toLowerCase() ||
      isFavorite !== file.isFavorite;

  const extensionChanged =
    extension.trim().toLowerCase() !== file.extension.toLowerCase();

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedExtension = extension.trim().toLowerCase().replace(/^\./, "");

    if (!file.isEncrypted && !trimmedName) {
      toastError("Filename cannot be empty");
      return;
    }

    if (!file.isEncrypted && !trimmedExtension) {
      toastError("Extension cannot be empty");
      return;
    }

    const payload: UpdateFilePayload = {
      fileId: file.id,
      isFavorite,
    };

    if (!file.isEncrypted) {
      payload.name = trimmedName;
      payload.extension = trimmedExtension;
    }

    try {
      await update.mutateAsync(payload);
      onClose();
    } catch (error) {
      toastError((error as Error)?.message || "Failed to update file");
    }
  };

  return (
    <FileModal title="Edit File" onClose={onClose} maxWidth="max-w-sm">
      <div className="space-y-4">
        {file.isEncrypted ? (
          <div className="border border-brand-border bg-brand-cream-muted p-3">
            <p className="text-xs font-bold text-brand-violet">
              Encrypted filename
            </p>
            <p className="mt-1 truncate text-sm text-brand-violet/80">
              {file.name}
              {file.extension ? `.${file.extension}` : ""}
            </p>
            <p className="mt-2 text-xs text-brand-violet/65">
              Renaming is disabled until encrypted metadata updates are implemented.
            </p>
          </div>
        ) : (
          <div>
            <label className="text-xs text-violet/60 mb-1 block">Name</label>
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSave()}
                disabled={update.isPending}
                className="flex-1 border border-brown/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ember"
              />
              <span className="text-violet/50">.</span>
              <input
                value={extension}
                onChange={(event) => setExtension(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSave()}
                disabled={update.isPending}
                className="w-16 border border-brown/30 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
              />
            </div>
            {extensionChanged && (
              <p className="text-xs text-amber-600 mt-1">
                Changing the extension won&apos;t convert the file - make sure it still matches the actual file type.
              </p>
            )}
          </div>
        )}

        <div>
          <label className="text-xs text-violet/60 mb-1 block">File type</label>
          <p className="text-sm text-violet/70 bg-brown/5 rounded-md px-3 py-2">
            {file.mimeType}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-violet">Favorite</span>
          <button
            type="button"
            onClick={() => setIsFavorite((current) => !current)}
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
