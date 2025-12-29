import { Download, Edit, FolderInput, Trash2, Eye } from "lucide-react";

import  ActionButton  from "../shared/ActionButton";
import { FileActionsProps } from "@/types/ui";



const FileActions = ({
  onView,
  onDownload,
  onEdit,
  onMove,
  onDelete,
}: FileActionsProps) => {
  return (
    <div className="col-span-4 flex justify-end items-center gap-2 flex-nowrap">
      <ActionButton
        onClick={onView}
        icon={<Eye className="w-4 h-4" />}
        variant="success"
        title="View File"
      />
      <ActionButton
        onClick={onDownload}
        icon={<Download className="w-4 h-4" />}
        variant="primary"
        title="Download File"
      />
      <ActionButton
        onClick={onEdit}
        icon={<Edit className="w-4 h-4" />}
        variant="secondary"
        title="Edit File Name"
      />
      <ActionButton
        onClick={onMove}
        icon={<FolderInput className="w-4 h-4" />}
        variant="secondary"
        title="Move File"
      />
      <ActionButton
        onClick={onDelete}
        icon={<Trash2 className="w-4 h-4" />}
        variant="danger"
        title="Delete File"
      />
    </div>
  );
};

export default FileActions;
