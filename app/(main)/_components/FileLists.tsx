"use client";
import { useEffect, useState } from "react";

import  FileItemRow  from "./files/FileRow";
import FileTableHeader from "./files/FileHeader";
import FileListHeader  from "./files/FileListHeader";

import  MoveModal  from "./shared/MoveModal";

import { FileItem } from "@/types/file";
import  useFileStore  from "@/context/useFileStore";
import  useFileHandlers  from "@/hooks/useFileHandlers";


const FileLists = ({ folderId, limit }: { folderId?: number; limit?: number }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const { files, fetchFiles, fetchFolders } = useFileStore();

  const {
    moveFolders,
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
  } = useFileHandlers({
    folderId,
    editName,
    setEditName,
    setEditingId,
    setOpenMenuId,
  });

  useEffect(() => {
    fetchFiles({ limit, folderId });
    fetchFolders({ limit, folderId });
  }, [fetchFiles, folderId, limit, fetchFolders]);

  return (
    <div>
      <div className="bg-ember h-full w-full p-3 text-peach rounded-md flex flex-col gap-2 mb-20">
        <FileListHeader />

        <div className="my-4">
          {files.length === 0 ? (
            <p className="text-center py-8">No files uploaded yet!!</p>
          ) : (
            <div className="flex flex-col gap-3">
              <FileTableHeader />

              {files.map((file: FileItem, idx: number) => (
                <FileItemRow
                  key={idx}
                  file={file}
                  isEditing={editingId === file.id}
                  editName={editName}
                  isMenuOpen={openMenuId === file.id}
                  onEditChange={setEditName}
                  onEditBlur={() => handleBlurSave(file)}
                  onEditKeyDown={handleKeyDown}
                  onView={() => handleView(file)}
                  onDownload={() => handleDownload(file)}
                  onEdit={() => handleEdit(file)}
                  onMove={() => handleMoveClick(file.id)}
                  onDelete={() => handleDelete(file.id)}
                  onToggleMenu={() =>
                    setOpenMenuId(openMenuId === file.id ? null : file.id)
                  }
                  onCloseMenu={() => setOpenMenuId(null)}
                />
              ))}
            </div>
          )}
        </div>

        {showMoveModal && (
           <MoveModal
            folders={moveFolders}
            onMove={handleConfirmMove}
            onClose={() => setShowMoveModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default FileLists;


