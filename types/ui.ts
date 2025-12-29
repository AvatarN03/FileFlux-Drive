import { LucideIcon } from "lucide-react";
import { FileItem, FolderItem, PathNode } from "./file";

type ID = number;
type VoidFn = () => void;

export type FeatureType = {
    title:string;
    description:string;
    icon:LucideIcon;
    class?:string;
    pos:string;
    cut:string
}

export interface FileActionsProps {
  file: FileItem;
  onView: VoidFn;
  onDownload: VoidFn;
  onEdit: VoidFn;
  onMove: VoidFn;
  onDelete: VoidFn;
}

export interface FileNameDisplayProps {
  file: FileItem;
  isEditing: boolean;
  editName: string;
  onEditChange: (value: string) => void;
  onBlur: VoidFn;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface FileItemRowProps {
  file: FileItem;
  isEditing: boolean;
  editName: string;
  isMenuOpen: boolean;
  onEditChange: (value: string) => void;
  onEditBlur: VoidFn;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onView: VoidFn;
  onDownload: VoidFn;
  onEdit: VoidFn;
  onMove: VoidFn;
  onDelete: VoidFn;
  onToggleMenu: VoidFn;
  onCloseMenu: VoidFn;
}

export interface MobileFileMenuProps {
  onView: VoidFn;
  onDownload: VoidFn;
  onEdit: VoidFn;
  onMove: VoidFn;
  onDelete: VoidFn;
  onClose: VoidFn;
}

export interface MoveFileModalProps {
  folders: FolderItem[];
  onMove: (folderId: ID) => void;
  onClose: VoidFn;
}

export interface UseFileHandlersProps {
  folderId?: ID;
  editName: string;
  setEditName: (name: string) => void;
  setEditingId: (id: ID | null) => void;
  setOpenMenuId: (id: ID | null) => void;
}

export interface FolderOption {
  id: ID;
  name: string;
}

export interface MoveModalProps {
  title?: string;
  folders: FolderOption[];
  onMove: (folderId: ID) => void;
  onClose: VoidFn;
}

export interface MobileActionMenuProps {
  children: React.ReactNode;
  onClose: VoidFn;
}

export interface ItemNameDisplayProps {
  name: string;
  icon: React.ReactNode;
  isEditing: boolean;
  editName: string;
  path?: PathNode[];
  onEditChange: (value: string) => void;
  onBlur: VoidFn;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface ActionButtonProps {
  onClick: VoidFn;
  icon: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  title?: string;
  className?: string;
}

export interface MobileFolderMenuProps {
  onEdit: VoidFn;
  onMove: VoidFn;
  onDelete: VoidFn;
  onClose: VoidFn;
}

export interface FolderListHeaderProps {
  onAddClick: VoidFn;
}

export interface FolderItemRowProps {
  folder: FolderItem;
  isEditing: boolean;
  editName: string;
  isMenuOpen: boolean;
  onEditChange: (value: string) => void;
  onEditBlur: VoidFn;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEdit: VoidFn;
  onMove: VoidFn;
  onDelete: VoidFn;
  onToggleMenu: VoidFn;
  onCloseMenu: VoidFn;
}

export interface FolderActionsProps {
  folderId: ID;
  onEdit: VoidFn;
  onMove: VoidFn;
  onDelete: VoidFn;
}

export interface AddFolderModalProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: VoidFn;
  onClose: VoidFn;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface UseFolderHandlersProps {
  folderId?: ID;
  newFolder: string;
  editName: string;
  setNewFolder: (name: string) => void;
  setEditName: (name: string) => void;
  setEditingId: (id: ID | null) => void;
  setOpenMenuId: (id: ID | null) => void;
  setOpenModel: (open: boolean) => void;
}

export interface FetchParams {
  folderId?: ID;
  limit?: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface UploadState {
  file: File | null;
  fileName: string;
  isEditingFileName: boolean;
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
}

export interface FilePreviewProps {
  file: File;
  fileName: string;
  isEditingFileName: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  onFileNameChange: (name: string) => void;
  onToggleEdit: VoidFn;
  onReset: VoidFn;
  onUpload: VoidFn;
}
