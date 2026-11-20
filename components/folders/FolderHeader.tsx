"use client";

import { useState } from "react";

import { FolderPlus } from "lucide-react";

import { useFolderCreate } from "@/hooks/useFolderMutations";

import AddFolderModal from "@/components/folders/AddFolderModal";

import toastC from "@/lib/toast";

import { FOLDER_COLOR_OPTIONS } from "@/types/folder";

interface FolderHeaderProps {
  title?: string;
  parentId?: string | null;
}

const FolderHeader = ({
  title = "Folder Workspaces",
  parentId,
}: FolderHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState<string>(FOLDER_COLOR_OPTIONS[0].value);
  const [isFavorite, setIsFavorite] = useState(false);

  const { mutate, isPending } = useFolderCreate();

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
          setFolderName("");
          setFolderColor(FOLDER_COLOR_OPTIONS[0].value);
          setIsFavorite(false);
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
      <div className="flex shrink-0 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-3 md:p-5 text-brand-violet">
        <div className="space-y-1">          
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-brand-violet/75">
            Organize files into encrypted folders and sub-directories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center ml-auto gap-1.5 px-4 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-brown shadow-violet-2 hover:translate-x-px hover:translate-y-px transition-all cursor-pointer"
          disabled={isPending}
        >
          <FolderPlus className="w-4 h-4 text-brand-peach" />
          New Folder
        </button>
      </div>

      {showModal && (
        <AddFolderModal
          value={folderName}
          onChange={setFolderName}
          onAdd={handleAddFolder}
          onClose={() => {
            if (isPending) return;
            setFolderName("");
            setFolderColor(FOLDER_COLOR_OPTIONS[0].value);
            setIsFavorite(false);
            setShowModal(false);
          }}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
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

export default FolderHeader;
