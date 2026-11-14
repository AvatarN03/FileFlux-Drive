"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Folder, FolderInput, Star } from "lucide-react";
import { GetAllFolders } from "@/types/folder";
import AddFolderModal from "./AddFolderModal";
import { useFolderUpdate } from "@/hooks/useFolderMutations";
import { useVault } from "@/context/VaultContext";
import toastC from "@/lib/toast";
import FolderMoveModal from "./FolderMoveModal";

type FolderItemProps = {
  folder: GetAllFolders[number];
};

export function FolderItem({ folder }: FolderItemProps) {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);
  const { mutate, isPending } = useFolderUpdate();
  const { isUnlocked } = useVault();

  const handleRename = () => {
    const trimmedName = folderName.trim();
    if (trimmedName.length < 3) return;

    mutate(
      { folderId: folder.id, name: trimmedName },
      {
        onSuccess: () => {
          setShowRenameModal(false);
          toastC({ data: "Folder renamed successfully", type: "success" });
        },
        onError: (error) => {
          toastC({ data: error.message || "Failed to rename folder", type: "error" });
        },
      }
    );
  };

  const handleMove = (parentId: string | null) => {
    mutate(
      { folderId: folder.id, parentId },
      {
        onSuccess: () => {
          setShowMoveModal(false);
          toastC({ data: "Folder moved successfully", type: "success" });
        },
        onError: (error) => {
          toastC({ data: error.message || "Failed to move folder", type: "error" });
        },
      },
    );
  };

  const handleFavorite = () => {
    mutate(
      { folderId: folder.id, isFavorite: !folder.isFavorite },
      {
        onSuccess: () => {
          toastC({
            data: folder.isFavorite ? "Folder removed from favorites" : "Folder added to favorites",
            type: "success",
          });
        },
        onError: (error) => {
          toastC({ data: error.message || "Failed to update favorite", type: "error" });
        },
      },
    );
  };

  return (
    <div className="bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-[2px_2px_0px_0px_#BA5624] p-3 transition-all flex items-center justify-between gap-2">
      <Link
        href={`/folders/${folder.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden"
      >
        <div className="w-9 h-9 bg-brand-peach border border-brand-violet/40 flex items-center justify-center shrink-0">
          <Folder className="h-5 w-5 text-brand-brown fill-brand-brown/20" />
        </div>

        <div className="truncate">
          <h3 className="truncate font-bold text-xs text-brand-violet hover:text-brand-brown transition-colors">
            {folder.name}
          </h3>
          <span className="text-[10px] font-mono text-brand-violet/60">
            Workspace folder
          </span>
        </div>
      </Link>
      <button
        type="button"
        title={folder.isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-label={folder.isFavorite ? `Remove ${folder.name} from favorites` : `Add ${folder.name} to favorites`}
        disabled={isPending}
        onClick={handleFavorite}
        className={`shrink-0 border-2 border-brand-violet p-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          folder.isFavorite
            ? "bg-brand-peach text-brand-brown"
            : "text-brand-violet hover:bg-brand-peach"
        }`}
      >
        <Star className="h-4 w-4" fill={folder.isFavorite ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        title="Rename folder"
        aria-label={`Rename ${folder.name}`}
        disabled={!isUnlocked}
        onClick={() => {
          setFolderName(folder.name);
          setShowRenameModal(true);
        }}
        className="shrink-0 border-2 border-brand-violet p-2 text-brand-violet hover:bg-brand-peach transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Move folder"
        aria-label={`Move ${folder.name}`}
        disabled={isPending}
        onClick={() => setShowMoveModal(true)}
        className="shrink-0 border-2 border-brand-violet p-2 text-brand-violet transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FolderInput className="h-4 w-4" />
      </button>

      {showRenameModal && (
        <AddFolderModal
          value={folderName}
          onChange={setFolderName}
          onAdd={handleRename}
          onClose={() => {
            if (!isPending) setShowRenameModal(false);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") handleRename();
          }}
          isPending={isPending}
          title="Rename Folder"
          submitLabel="Save Name"
        />
      )}
      {showMoveModal && (
        <FolderMoveModal
          folderName={folder.name}
          isPending={isPending}
          onClose={() => {
            if (!isPending) setShowMoveModal(false);
          }}
          onMove={handleMove}
        />
      )}
    </div>
  );
}
