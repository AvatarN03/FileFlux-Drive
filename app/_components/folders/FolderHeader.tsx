"use client";

import { useState } from "react";
import AddFolderModal from "./AddFolderModal";
import { useFolderCreate } from "@/hooks/useFolderMutations";
import { FolderPlus, FolderTree } from "lucide-react";
import toastC from "@/lib/toast";

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
      },
      {
        onSuccess: () => {
          setFolderName("");
          setShowModal(false);
          toastC({ data: "Folder created successfully", type: "success" });
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 text-brand-violet">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <FolderTree className="w-3 h-3 text-brand-brown" />
            FileFlux Hierarchical File System
          </div>
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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
          disabled={isPending}
        >
          <FolderPlus className="w-4 h-4 text-brand-peach" />
          + New Folder
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
            setShowModal(false);
          }}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleAddFolder();
            }
          }}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default FolderHeader;
