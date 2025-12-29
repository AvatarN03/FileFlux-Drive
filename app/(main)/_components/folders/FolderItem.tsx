import Link from "next/link";

import { FolderIcon, MoreVertical } from "lucide-react";

import  FolderActions  from "./FolderAction";
import  MobileFolderMenu  from "./MobileFolderMenu";

import  ItemNameDisplay  from "../shared/ItemNameDisplay";

import { FolderItemRowProps } from "@/types/file";
import { formatFileSize } from "@/lib/file/fileFunctions";



const FolderItemRow = ({
  folder,
  isEditing,
  editName,
  isMenuOpen,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
  onEdit,
  onMove,
  onDelete,
  onToggleMenu,
  onCloseMenu,
}: FolderItemRowProps) => {
  return (
    <div className="md:border-b border-brown group hover:bg-brown transition rounded-md p-3 text-peach hover:text-violet">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
        <div className="col-span-4">
          <ItemNameDisplay
            name={folder.name}
            icon={<FolderIcon className="stroke-3 w-8 h-8" />}
            isEditing={isEditing}
            editName={editName}
            onEditChange={onEditChange}
            onBlur={onEditBlur}
            onKeyDown={onEditKeyDown}
          />
        </div>

        <div className="col-span-2">
          <span className="font-medium">{folder.fileCount}</span>
        </div>

        <div className="col-span-2">
          <span className="font-bold">
            {formatFileSize(Number(folder.totalSize))}
          </span>
        </div>

        <FolderActions
          folderId={folder.id}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex justify-between items-start gap-3 text-peach hover:text-violet">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              autoFocus
              onChange={(e) => onEditChange(e.target.value)}
              onBlur={onEditBlur}
              onKeyDown={onEditKeyDown}
              className="w-full px-2 py-1 rounded font-medium focus:outline-none focus:ring-2 focus:ring-violet"
            />
          ) : (
            <div className="mb-2">
              <Link
                href={`/folders/${folder.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-brown/10 font-medium rounded-t-lg"
                onClick={onCloseMenu}
              >
                <FolderIcon className="stroke-3" />
                {folder.name}
              </Link>
            </div>
          )}

          <div className="text-xs font-bold">
            {folder.fileCount} files • {formatFileSize(Number(folder.totalSize))}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={onToggleMenu}
            className="p-2 hover:bg-ember/80 cursor-pointer rounded-full transition"
            title="More actions"
          >
            <MoreVertical className="w-5 h-5 text-violet" />
          </button>

          {isMenuOpen && (
            <MobileFolderMenu
              onEdit={onEdit}
              onMove={onMove}
              onDelete={onDelete}
              onClose={onCloseMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderItemRow;