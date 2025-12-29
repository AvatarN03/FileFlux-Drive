import { MoreVertical } from "lucide-react";

import  FileActions  from "./FileActions";
import MobileFileMenu from "./MobileFileMenu";

import  ItemNameDisplay  from "../shared/ItemNameDisplay";

import { formatFileSize } from "@/lib/file/fileFunctions";
import { getReadableFileType } from "@/lib/file/fileType";
import { getFileIcon } from "@/lib/file/getFileIcon";
import { FileItemRowProps } from "@/types/ui";


const FileItemRow = ({
  file,
  isEditing,
  editName,
  isMenuOpen,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
  onView,
  onDownload,
  onEdit,
  onMove,
  onDelete,
  onToggleMenu,
  onCloseMenu,
}: FileItemRowProps) => {
  return (
    <div className="border-b border-brown/30 group hover:bg-brown transition rounded-md p-3">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
        <div className="col-span-4">
          <ItemNameDisplay
            name={file.file_name}
            icon={getFileIcon(file.file_type)}
            isEditing={isEditing}
            editName={editName}
            path={file.path}
            onEditChange={onEditChange}
            onBlur={onEditBlur}
            onKeyDown={onEditKeyDown}
          />
        </div>

        <div className="col-span-2">
          <p className="text-sm group-hover:text-violet group-hover:font-bold">
            {getReadableFileType(file.file_type)}
          </p>
        </div>

        <div className="col-span-2">
          <span className="text-brown group-hover:text-violet font-bold">
            {file.file_size ? formatFileSize(file.file_size) : "N/A"}
          </span>
        </div>

        <FileActions
          file={file}
          onView={onView}
          onDownload={onDownload}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <ItemNameDisplay
            name={file.file_name}
            icon={getFileIcon(file.file_type)}
            isEditing={isEditing}
            editName={editName}
            path={file.path}
            onEditChange={onEditChange}
            onBlur={onEditBlur}
            onKeyDown={onEditKeyDown}
          />
          <div className="col-span-2">
            <p className="text-sm group-hover:text-violet group-hover:font-bold ml-10">
              {getReadableFileType(file.file_type)}
            </p>
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
            <MobileFileMenu
              onView={onView}
              onDownload={onDownload}
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

export default FileItemRow;