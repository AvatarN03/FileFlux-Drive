import { useState } from "react";

import  useFileStore  from "@/context/useFileStore";

import { Folder, FolderItem} from "@/types/file";
import { UseFolderHandlersProps } from "@/types/ui";


export const useFolderHandlers = ({
  folderId,
  newFolder,
  editName,
  setNewFolder,
  setEditName,
  setEditingId,
  setOpenMenuId,
  setOpenModel,
}: UseFolderHandlersProps) => {
  const [moveFolders, setMoveFolders] = useState<FolderItem[]>([]);
  const [movingFolderId, setMovingFolderId] = useState<number | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const { addFolder, updateFolder, deleteFolder, moveFolder, getAllFolders } =
    useFileStore();

  const handleAddFolder = () => {
    if (!newFolder) return;

    addFolder({ folderId, newFolder });
    setNewFolder("");
    setOpenModel(false);
  };

  const handleEdit = (folder: Folder) => {
    setEditingId(folder.id);
    setEditName(folder.name);
    setOpenMenuId(null);
  };

  const handleDelete = (folderId: number) => {
    const confirm = window.confirm(
      "Are you sure to delete the folder? Note: the files in this folder will also be deleted."
    );
    if (confirm) {
      deleteFolder({ folderId });
    }
    setOpenMenuId(null);
  };

  const handleMoveClick = async (folderId: number) => {
    setOpenMenuId(null);
    setMovingFolderId(folderId);

    const folders = await getAllFolders();
    let filtered = folders;
    if (folderId) {
      filtered = folders.filter((f) => f.id !== folderId);
    }

    setMoveFolders(filtered);
    setShowMoveModal(true);
  };

  const handleConfirmMove = async (targetFolderId: number) => {
    if (!movingFolderId) return;

    await moveFolder({
      folderId: movingFolderId,
      parentId: targetFolderId === 0 ? undefined : targetFolderId,
    });

    setShowMoveModal(false);
    setMovingFolderId(null);
  };

  const handleBlurSave = (folder: Folder) => {
    const trimmed = editName.trim();

    if (!trimmed || trimmed === folder.name) {
      setEditingId(null);
      setEditName("");
      return;
    }

    updateFolder({
      folderId: folder.id,
      editName: trimmed,
    });

    setEditingId(null);
    setEditName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddFolder();
    } else if (e.key === "Escape") {
      setOpenModel(false);
    }
  };

  return {
    moveFolders,
    movingFolderId,
    showMoveModal,
    handleAddFolder,
    handleEdit,
    handleDelete,
    handleMoveClick,
    handleConfirmMove,
    handleBlurSave,
    handleKeyPress,
    setShowMoveModal,
  };
};