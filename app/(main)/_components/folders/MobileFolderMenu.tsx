import { Edit, FolderInput, Trash2 } from "lucide-react";
import  MobileActionMenu  from "../shared/MobileActionMenu";
import { MobileFolderMenuProps } from "@/types/file";

const MobileFolderMenu = ({
  onEdit,
  onMove,
  onDelete,
  onClose,
}: MobileFolderMenuProps) => {
  return (
    <MobileActionMenu onClose={onClose}>
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brown/10 text-ember border-b border-brown/20"
      >
        <Edit className="w-5 h-5" />
        <span>Edit Name</span>
      </button>
      <button
        onClick={onMove}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brown/10 text-ember border-b border-brown/20"
      >
        <FolderInput className="w-5 h-5" />
        <span>Move Folder</span>
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brown/10 text-red-600 rounded-b-lg"
      >
        <Trash2 className="w-5 h-5" />
        <span>Delete</span>
      </button>
    </MobileActionMenu>
  );
};

export default MobileFolderMenu;