import { FolderIcon } from "lucide-react";
import { MoveModalProps } from "@/types/ui";



const MoveModal = ({
  title = "Move to folder",
  folders,
  onMove,
  onClose,
}: MoveModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-peach p-5 rounded-lg w-[300px] text-violet"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        {folders.map((folder) => (
          <button
            key={folder.id}
            className="w-full text-left px-3 flex items-center gap-2 py-2 bg-brown/50 hover:bg-ember hover:text-green my-1 text-violet font-bold rounded"
            onClick={() => onMove(folder.id)}
          >
            <FolderIcon />
            {folder.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoveModal;