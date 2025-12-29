import { Download, Edit, FolderInput, Trash2, Eye } from "lucide-react";

import  MobileActionMenu  from "../shared/MobileActionMenu";
import { MobileFileMenuProps } from "@/types/ui";





const MobileFileMenu = ({
  onView,
  onDownload,
  onEdit,
  onMove,
  onDelete,
  onClose,
}: MobileFileMenuProps) => {
  return (
     <MobileActionMenu onClose={onClose}>
          <button
            onClick={onView}
            className="w-full flex items-center gap-3 p-3 hover:bg-brown/10 text-violet font-medium border-b border-brown/20 rounded-t-lg"
          >
            <Eye className="w-5 h-5" />
            <span>View</span>
          </button>
          <button
            onClick={onDownload}
            className="w-full flex items-center gap-3 p-3 hover:bg-brown/10 text-violet font-medium border-b border-brown/20"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button
            onClick={onEdit}
            className="w-full flex items-center gap-3 p-3 hover:bg-brown/10 text-ember border-b border-brown/20"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Name</span>
          </button>
          <button
            onClick={onMove}
            className="w-full flex items-center gap-3 p-3 hover:bg-brown/10 text-ember border-b border-brown/20"
          >
            <FolderInput className="w-5 h-5" />
            <span>Move File</span>
          </button>
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-3 p-3 hover:bg-brown/10 text-red-600 rounded-b-lg"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </MobileActionMenu>
  );
};

export default MobileFileMenu;