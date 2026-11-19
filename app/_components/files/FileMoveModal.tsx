"use client";

import type { FileItem } from "@/types/file";
import { useFileMutations } from "@/hooks/useFileMutations";
import { toastError, toastSuccess } from "@/lib/toast";
import MoveModal from "../shared/MoveModal";

type FileMoveModalProps = {
  file: FileItem;
  onClose: () => void;
};

const FileMoveModal = ({ file, onClose }: FileMoveModalProps) => {
  const { move } = useFileMutations();
  const itemName = file.extension
    ? `${file.name}.${file.extension}`
    : file.name;

  const handleMove = async (toFolderId: string | null) => {
    try {
      await move.mutateAsync({ fileId: file.id, toFolderId });
      toastSuccess("File moved successfully");
      onClose();
    } catch (error) {
      toastError((error as Error)?.message || "Failed to move file");
    }
  };

  return (
    <MoveModal
      itemName={itemName}
      currentFolderId={file.folderId}
      isPending={move.isPending}
      onMove={handleMove}
      onClose={onClose}
    />
  );
};

export default FileMoveModal;
