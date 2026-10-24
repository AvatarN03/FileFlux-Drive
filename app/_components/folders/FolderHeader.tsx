"use client";

import { useState } from "react";
import AddFolderModal from "./AddFolderModal";
import { useFolderCreate } from "@/hooks/useFolderMutations";
import toastC from "@/lib/toast";

interface FolderHeaderProps {
  title?: string;
  parentId?: string | null;
}

const FolderHeader = ({
  title = "Folders",
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 transition-colors"
          disabled={isPending}
        >
          Create Folder
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