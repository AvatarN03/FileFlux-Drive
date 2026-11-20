"use client";

import { useState } from "react";
import { ArrowLeft, Folder, FolderInput, X } from "lucide-react";

import { useFoldersAll } from "@/hooks/useFolderQueries";

type FolderMoveModalProps = {
  folderName: string;
  isPending: boolean;
  onClose: () => void;
  onMove: (parentId: string | null) => void;
};

type Destination = { id: string; name: string };

export default function FolderMoveModal({
  folderName,
  isPending,
  onClose,
  onMove,
}: FolderMoveModalProps) {
  const [path, setPath] = useState<Destination[]>([]);
  const currentParentId = path.at(-1)?.id ?? null;
  const { data: folders = [], isLoading, isError } = useFoldersAll(currentParentId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-violet-dark/60 p-4 backdrop-blur-xs"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="folder-move-title"
        className="w-full max-w-md border-2 border-brand-violet bg-brand-cream p-5 text-brand-violet shadow-brown-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b-2 border-brand-border pb-3">
          <div>
            <h2 id="folder-move-title" className="text-base font-extrabold">
              Move folder
            </h2>
            <p className="mt-1 text-xs text-brand-violet/70">
              Choose where to move <span className="font-bold">{folderName}</span>.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close move dialog"
            disabled={isPending}
            onClick={onClose}
            className="border border-transparent p-1 hover:border-brand-border hover:bg-brand-cream-muted disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 flex min-h-9 items-center gap-2 overflow-x-auto text-xs">
          {path.length > 0 && (
            <button
              type="button"
              onClick={() => setPath((current) => current.slice(0, -1))}
              className="inline-flex shrink-0 items-center gap-1 border-2 border-brand-border px-2 py-1 font-bold hover:bg-brand-peach"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}
          <span className="truncate font-mono text-brand-violet/70">
            {path.length ? path.map(({ name }) => name).join(" / ") : "Root"}
          </span>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto border-y border-brand-border py-3">
          {isLoading && <p className="py-4 text-center text-xs">Loading folders…</p>}
          {isError && (
            <p role="alert" className="py-4 text-center text-xs text-red-700">
              Could not load folders at this location.
            </p>
          )}
          {!isLoading && !isError && folders.length === 0 && (
            <p className="py-4 text-center text-xs text-brand-violet/65">
              No subfolders here. You can choose this location below.
            </p>
          )}
          {!isLoading && !isError && folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              disabled={isPending}
              onClick={() => setPath((current) => [...current, { id: folder.id, name: folder.name }])}
              className="flex w-full items-center gap-2 border-2 border-brand-border bg-brand-cream-muted px-3 py-2 text-left text-xs font-bold hover:bg-brand-peach disabled:opacity-50"
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={isPending || isLoading || isError}
            onClick={() => onMove(currentParentId)}
            className="inline-flex items-center gap-1 border-2 border-brand-brown bg-brand-brown px-3 py-2 text-xs font-bold text-brand-cream shadow-violet-2 hover:bg-brand-brown-dark disabled:opacity-50"
          >
            <FolderInput className="h-4 w-4" />
            {isPending ? "Moving…" : path.length ? "Move here" : "Move to root"}
          </button>
        </div>
      </section>
    </div>
  );
}
