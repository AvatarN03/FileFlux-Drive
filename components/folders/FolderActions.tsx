"use client";

import { useState } from "react";

import { FolderPlus } from "lucide-react";

import { useFolderCreate } from "@/hooks/useFolderMutations";

import UploadButton from "@/app/_components/upload/UploadButton";
import AddFolderModal from "@/components/folders/AddFolderModal";

import toastC from "@/lib/toast";

import { FOLDER_COLOR_OPTIONS } from "@/types/folder";

interface FolderActionsProps {
  parentId?: string | null;
  folderLabel?: string;
  showUpload?: boolean;
  variant?: "header" | "inline";
}

const FolderActions = ({
  parentId,
  folderLabel = "New Folder",
  showUpload = true,
  variant = "inline",
}: FolderActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState<string>(FOLDER_COLOR_OPTIONS[0].value);
  const [isFavorite, setIsFavorite] = useState(false);

  const { mutate, isPending } = useFolderCreate();
  const isHeader = variant === "header";

  const resetForm = () => {
    setFolderName("");
    setFolderColor(FOLDER_COLOR_OPTIONS[0].value);
    setIsFavorite(false);
  };

  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    const trimmedName = folderName.trim();

    if (trimmedName.length < 3) {
      toastC({
        data: "Folder name must be at least 3 characters long.",
        type: "error",
      });
      return;
    }

    mutate(
      {
        name: trimmedName,
        parentId,
        color: folderColor,
        isFavorite,
      },
      {
        onSuccess: () => {
          resetForm();
          setShowModal(false);
          toastC({ data: "Folder created successfully", type: "success" });
        },
        onError: (err) => {
          toastC({
            data: err.message || "Failed to create folder",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={isHeader
            ? "ml-auto inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-2 border-brand-brown bg-brand-brown px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-cream shadow-violet-2 transition-all hover:translate-x-px hover:translate-y-px hover:bg-brand-brown-dark"
            : "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border-2 border-brand-violet bg-brand-cream-muted px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-violet shadow-brown-2 transition-all hover:bg-brand-peach disabled:cursor-not-allowed disabled:opacity-50"}
          disabled={isPending}
        >
          <FolderPlus className={isHeader ? "h-4 w-4 text-brand-peach" : "h-4 w-4 text-brand-brown"} />
          {folderLabel}
        </button>
        {showUpload && (
          <UploadButton
            folderId={parentId}
            label="Upload Files"
            className="inline-flex cursor-pointer items-center justify-center border-2 border-brand-violet bg-brand-peach px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-violet shadow-brown-2 transition-all hover:bg-brand-peach-vibrant"
          />
        )}
      </div>

      {showModal && (
        <AddFolderModal
          value={folderName}
          onChange={setFolderName}
          onAdd={handleAddFolder}
          onClose={() => {
            if (isPending) return;
            resetForm();
            setShowModal(false);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleAddFolder();
            }
          }}
          isPending={isPending}
          showFolderOptions
          color={folderColor}
          onColorChange={setFolderColor}
          isFavorite={isFavorite}
          onFavoriteChange={setIsFavorite}
        />
      )}
    </>
  );
};

export default FolderActions;
