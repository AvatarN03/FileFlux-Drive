"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AlertTriangle,
  Edit,
  Folder,
  FolderInput,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";

import { useFolderDelete, useFolderUpdate } from "@/hooks/useFolderMutations";

import { useVault } from "@/context/VaultContext";

import AddFolderModal from "@/components/folders/AddFolderModal";
import FileModal from "@/app/_components/FileModal";
import FolderMoveModal from "@/app/_components/folders/FolderMoveModal";
import { TableCell, TableRow } from "@/components/ui/table";

import toastC from "@/lib/toast";

import { FOLDER_COLOR_OPTIONS } from "@/types/folder";
import type { GetAllFolders } from "@/types/folder";

type FolderItemProps = {
  folder: GetAllFolders[number];
};

export function FolderItem({ folder }: FolderItemProps) {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);
  const [folderColor, setFolderColor] = useState(
    folder.color ?? FOLDER_COLOR_OPTIONS[0].value,
  );
  const { mutate, isPending } = useFolderUpdate();
  const { mutateAsync: deleteFolder, isPending: isDeleting } = useFolderDelete();
  const { isUnlocked } = useVault();
  const isBusy = isPending || isDeleting;

  const openRenameModal = () => {
    if (!isUnlocked || isBusy) return;

    setFolderName(folder.name);
    setFolderColor(folder.color ?? FOLDER_COLOR_OPTIONS[0].value);
    setShowRenameModal(true);
  };

  const openMoveModal = () => {
    if (!isUnlocked || isBusy) return;

    setShowMoveModal(true);
  };

  const openDeleteConfirmation = () => {
    if (!isUnlocked || isBusy) return;

    setDeleteError(null);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirmation = () => {
    if (isBusy) return;

    setDeleteError(null);
    setShowDeleteConfirm(false);
  };

  const handleRename = () => {
    if (!isUnlocked) return;

    const trimmedName = folderName.trim();
    if (trimmedName.length < 3) return;

    mutate(
      { folderId: folder.id, name: trimmedName, color: folderColor },
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
    if (!isUnlocked) return;

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
    if (!isUnlocked) return;

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

  const handleDelete = async () => {
    if (!isUnlocked) return;

    try {
      await deleteFolder(folder.id);
      setShowDeleteConfirm(false);
      toastC({ data: "Folder tree moved to trash", type: "success" });
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to move folder to trash",
      );
    }
  };

  return (
    <TableRow className="border-brand-border bg-brand-cream hover:bg-brand-cream-muted">
      <TableCell className="min-w-0 px-3 py-3 sm:px-4">
        <Link
          href={`/folders/${folder.id}`}
          className="flex min-w-0 items-center gap-3 overflow-hidden"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-violet/40 bg-brand-peach">
            <Folder
              className="h-5 w-5 fill-current"
              style={{ color: folder.color ?? "var(--brand-brown)" }}
            />
          </div>

          <div className="min-w-0 truncate">
            <h3 className="truncate text-xs font-bold text-brand-violet transition-colors hover:text-brand-brown">
              {folder.name}
            </h3>
          </div>
        </Link>
      </TableCell>
      <TableCell className="w-0 px-3 py-3 text-right sm:px-4">
        <div className="hidden items-center justify-end gap-2 md:flex">
        <button
          type="button"
          title={folder.isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={folder.isFavorite ? `Remove ${folder.name} from favorites` : `Add ${folder.name} to favorites`}
          disabled={!isUnlocked || isBusy}
          onClick={handleFavorite}
          className={`shrink-0 border-2 border-brand-violet p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
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
          disabled={!isUnlocked || isBusy}
          onClick={openRenameModal}
          className="shrink-0 border-2 border-brand-violet p-2 text-brand-violet transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Move folder"
          aria-label={`Move ${folder.name}`}
          disabled={!isUnlocked || isBusy}
          onClick={openMoveModal}
          className="shrink-0 border-2 border-brand-violet p-2 text-brand-violet transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FolderInput className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Move folder to trash"
          aria-label={`Move ${folder.name} to trash`}
          disabled={!isUnlocked || isBusy}
          onClick={openDeleteConfirmation}
          className="shrink-0 border-2 border-brand-violet p-2 text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        </div>

        <div className="relative md:hidden">
          <button
            type="button"
            title="Folder actions"
            aria-label={`Actions for ${folder.name}`}
            aria-expanded={showMobileMenu}
            disabled={!isUnlocked || isBusy}
            onClick={() => setShowMobileMenu((isOpen) => !isOpen)}
            className="border-2 border-brand-violet p-2 text-brand-violet transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMobileMenu && isUnlocked && (
            <div className="absolute right-0 top-full z-30 mt-2 w-52 border-2 border-brand-violet bg-brand-cream text-left text-xs text-brand-violet">
            <button
              type="button"
              disabled={!isUnlocked || isBusy}
              onClick={() => {
                handleFavorite();
                setShowMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 border-b border-brand-border px-3 py-2.5 text-left font-semibold transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Star className="h-4 w-4" fill={folder.isFavorite ? "currentColor" : "none"} />
              {folder.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>
            <button
              type="button"
              disabled={!isUnlocked || isBusy}
              onClick={() => {
                openRenameModal();
                setShowMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 border-b border-brand-border px-3 py-2.5 text-left font-semibold transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Edit className="h-4 w-4" />
              Rename folder
            </button>
            <button
              type="button"
              disabled={!isUnlocked || isBusy}
              onClick={() => {
                openMoveModal();
                setShowMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 border-b border-brand-border px-3 py-2.5 text-left font-semibold transition-colors hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FolderInput className="h-4 w-4" />
              Move folder
            </button>
            <button
              type="button"
              disabled={!isUnlocked || isBusy}
              onClick={() => {
                openDeleteConfirmation();
                setShowMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Move to trash
            </button>
            </div>
          )}
        </div>

      {showRenameModal && (
        <AddFolderModal
          value={folderName}
          onChange={setFolderName}
          onAdd={handleRename}
          onClose={() => {
            if (!isBusy) setShowRenameModal(false);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") handleRename();
          }}
          isPending={isBusy}
          showColorOption
          color={folderColor}
          onColorChange={setFolderColor}
          title="Rename Folder"
          submitLabel="Save Name"
        />
      )}
      {showMoveModal && (
        <FolderMoveModal
          folderName={folder.name}
          isPending={isBusy}
          onClose={() => {
            if (!isBusy) setShowMoveModal(false);
          }}
          onMove={handleMove}
        />
      )}
      {showDeleteConfirm && (
        <FileModal
          title="Move Folder to Trash"
          onClose={closeDeleteConfirmation}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 border-2 border-brand-brown bg-brand-peach/30 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-brown" />
              <p className="text-xs font-medium leading-relaxed text-brand-violet">
                Move <span className="font-bold text-brand-brown">{folder.name}</span> and its empty subfolders to Trash? Items in Trash are permanently cleared after 30 days. Folder trees containing files cannot be moved to Trash.
              </p>
            </div>
            {deleteError && (
              <p
                role="alert"
                className="border-2 border-red-700 bg-red-50 p-3 text-xs font-bold leading-relaxed text-red-800"
              >
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={isBusy}
                className="px-3 py-1.5 text-xs font-bold text-brand-violet bg-brand-cream-muted border-2 border-brand-border hover:bg-brand-cream cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="px-3 py-1.5 text-xs font-bold text-brand-cream bg-red-600 hover:bg-red-700 border-2 border-red-800 shadow-violet-2 cursor-pointer transition-colors"
              >
                {isDeleting ? "Moving..." : "Move to Trash"}
              </button>
            </div>
          </div>
        </FileModal>
      )}
      </TableCell>
    </TableRow>
  );
}
