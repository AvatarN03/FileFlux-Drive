
import { useState } from "react";

import  useFileStore  from "@/context/useFileStore";

import { FileItem, FolderItem } from "@/types/file";
import { UseFileHandlersProps } from "@/types/ui";

const useFileHandlers = ({
  folderId,
  editName,
  setEditName,
  setEditingId,
  setOpenMenuId,
}: UseFileHandlersProps) => {
  const [moveFolders, setMoveFolders] = useState<FolderItem[]>([]);
  const [movingFileId, setMovingFileId] = useState<number | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const { deleteFile, renameFile, moveFile, getAllFolders } = useFileStore();

  const handleEdit = (file: FileItem) => {
    const nameWithoutExt = file.file_name.replace(/\.[^/.]+$/, "");
    setEditName(nameWithoutExt);
    setEditingId(file.id);
  };

  const handleDelete = async (fileId: number) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (confirm) {
      await deleteFile({ fileId, folderId });
    }
    setOpenMenuId(null);
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const res = await fetch(file.file_url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      // window.open(blobUrl, "_blank");

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleView = async (file: FileItem) => {
    try {
      const res = await fetch(file.file_url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    } catch (err) {
      console.error("View failed", err);
    }
  };

  const handleMoveClick = async (fileId: number) => {
    setMovingFileId(fileId);

    const folders = await getAllFolders();
    let filtered = folders;
    if (folderId) {
      filtered = folders.filter((f) => f.id !== folderId);
    }

    setMoveFolders(filtered);
    setShowMoveModal(true);
  };

  const handleConfirmMove = async (targetFolderId: number) => {
    if (!movingFileId) return;

    await moveFile({
      fileId: movingFileId,
      moveToFolderId: targetFolderId,
      folderId,
    });

    setShowMoveModal(false);
    setMovingFileId(null);
  };

  
    const handleBlurSave = async (file: FileItem) => {
    if (!file) return;
    
    const nameWithoutExt = file.file_name.replace(/\.[^/.]+$/, "");
    
    // Check if the name actually changed
    if (!editName.trim() || editName === nameWithoutExt) {
      setEditingId(null);
      return;
    }

    await renameFile({
      fileId: file.id,
      newName: editName,
      folderId,
    });

    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return {
    moveFolders,
    movingFileId,
    showMoveModal,
    handleEdit,
    handleDelete,
    handleDownload,
    handleView,
    handleMoveClick,
    handleConfirmMove,
    handleBlurSave,
    handleKeyDown,
    setShowMoveModal,
  };
};

export default useFileHandlers;