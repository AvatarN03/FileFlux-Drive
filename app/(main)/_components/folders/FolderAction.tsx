import Link from "next/link";

import { Edit, FolderInput, Trash2, Eye } from "lucide-react";

import  ActionButton  from "../shared/ActionButton";

import { FolderActionsProps } from "@/types/file";



const FolderActions = ({
  folderId,
  onEdit,
  onMove,
  onDelete,
}: FolderActionsProps) => {
  return (
    <div className="col-span-4 flex justify-end items-center gap-2 flex-nowrap">
      <Link href={`/folders/${folderId}`}>
        <ActionButton
          onClick={() => {}}
          icon={<Eye className="w-4 h-4" />}
          variant="primary"
          title="View Folder"
        />
      </Link>
      <ActionButton
        onClick={onEdit}
        icon={<Edit className="w-4 h-4" />}
        variant="secondary"
        title="Edit Folder"
      />
      <ActionButton
        onClick={onMove}
        icon={<FolderInput className="w-4 h-4" />}
        variant="secondary"
        title="Move Folder"
      />
      <ActionButton
        onClick={onDelete}
        icon={<Trash2 className="w-4 h-4" />}
        variant="danger"
        title="Delete Folder"
      />
    </div>
  );
};


export default FolderActions;