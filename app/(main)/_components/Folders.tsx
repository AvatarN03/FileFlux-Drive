"use client";
import { useEffect, useState } from "react";

import  FolderListHeader  from "./folders/FolderListHeader";
import  FolderTableHeader  from "./folders/FolderTableHeader";
import  AddFolderModal from "./folders/AddFolderModal";
import  FolderItemRow  from "./folders/FolderItem";

import MoveModal  from "./shared/MoveModal";

import useFileStore from "@/context/useFileStore";
import { useFolderHandlers } from "@/hooks/useFolderHandlers";

const Folders = ({ folderId, limit }: { folderId?: number; limit?: number }) => {
  const [openModel, setOpenModel] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const { fetchFolders, folders } = useFileStore();

  const {
    moveFolders,
    showMoveModal,
    handleAddFolder,
    handleEdit,
    handleDelete,
    handleMoveClick,
    handleConfirmMove,
    handleBlurSave,
    handleKeyPress,
    setShowMoveModal,
  } = useFolderHandlers({
    folderId,
    newFolder,
    editName,
    setNewFolder,
    setEditName,
    setEditingId,
    setOpenMenuId,
    setOpenModel,
  });

  useEffect(() => {
    fetchFolders({ folderId, limit });
  }, [fetchFolders, limit, folderId]);

  return (
    <div>
      <div className="bg-ember h-full w-full p-3 text-peach rounded-md flex flex-col gap-2">
        <FolderListHeader onAddClick={() => setOpenModel((prev) => !prev)} />

        <div className="my-4">
          {folders.length === 0 ? (
            <p className="text-center py-8">No folder created yet!!</p>
          ) : (
            <div className="flex flex-col gap-3">
              <FolderTableHeader />

              {folders.map((folder, idx) => (
                <FolderItemRow
                  key={idx}
                  folder={folder}
                  isEditing={editingId === folder.id}
                  editName={editName}
                  isMenuOpen={openMenuId === folder.id}
                  onEditChange={setEditName}
                  onEditBlur={() => handleBlurSave(folder)}
                  onEditKeyDown={(e: { key: string; }) => {
                    if (e.key === "Enter") handleBlurSave(folder);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditName("");
                    }
                  }}
                  onEdit={() => handleEdit(folder)}
                  onMove={() => handleMoveClick(folder.id)}
                  onDelete={() => handleDelete(folder.id)}
                  onToggleMenu={() =>
                    setOpenMenuId(openMenuId === folder.id ? null : folder.id)
                  }
                  onCloseMenu={() => setOpenMenuId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {openModel && (
        <AddFolderModal
          value={newFolder}
          onChange={setNewFolder}
          onAdd={handleAddFolder}
          onClose={() => setOpenModel(false)}
          onKeyPress={handleKeyPress}
        />
      )}

      {showMoveModal && (
        <MoveModal
          folders={moveFolders}
          onMove={handleConfirmMove}
          onClose={() => setShowMoveModal(false)}
        />
      )}
    </div>
  );
};

export default Folders;

