import { ReactNode, MouseEvent, FocusEvent, KeyboardEvent } from "react";
import { LucideIcon } from "lucide-react";

export type FeatureType = {
  title: string;
  description: string;
  icon: LucideIcon;
  class?: string;
  pos: string;
  cut: string;
};

export type NavSection = {
  key: string;
  icon: LucideIcon;
  label: string;
  href: string;
};

// Common breadcrumb item
export interface BreadcrumbItem {
  id: string | number;
  name: string;
}

// ActionButton Props
export type ActionButtonVariant = "primary" | "secondary" | "danger" | "success";

export interface ActionButtonProps {
  onClick?: (e?: MouseEvent) => void;
  icon?: ReactNode;
  label?: string;
  variant?: ActionButtonVariant;
  title?: string;
  className?: string;
}

// MobileActionMenu Props
export interface MobileActionMenuProps {
  children: ReactNode;
  onClose: () => void;
}

// ItemNameDisplay Props
export interface ItemNameDisplayProps {
  name: string;
  icon?: ReactNode;
  isEditing?: boolean;
  editName?: string;
  path?: BreadcrumbItem[];
  onEditChange: (val: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

// MoveModal Props
export interface MoveModalProps {
  title?: string;
  folders: {
    id: string | number;
    name: string;
  }[];
  onMove: (folderId: string | number) => void;
  onClose: () => void;
}

// Folder UI Props
export interface FolderActionsProps {
  folderId: string | number;
  onEdit: () => void;
  onMove: () => void;
  onDelete: () => void;
}

export interface FolderListHeaderProps {
  onAddClick: () => void;
  folderName?: string;
  folderPath?: BreadcrumbItem[];
}

export interface MobileFolderMenuProps {
  onEdit: () => void;
  onMove: () => void;
  onDelete: () => void;
  onClose: () => void;
}

// File UI Props
export interface FileActionsProps {
  file?: unknown;
  onView: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onMove: () => void;
  onDelete: () => void;
}

export interface MobileFileMenuProps {
  onView: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onMove: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export interface FileItemRowProps {
  file: {
    id: string | number;
    file_name: string;
    file_type?: string | null;
    file_size?: number | null;
    path?: BreadcrumbItem[];
    [key: string]: unknown;
  };
  isEditing: boolean;
  editName: string;
  isMenuOpen: boolean;
  onEditChange: (val: string) => void;
  onEditBlur: () => void;
  onEditKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onView: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onMove: () => void;
  onDelete: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

export interface FilePreviewProps {
  file: File;
  fileName: string;
  isEditingFileName: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  onFileNameChange: (name: string) => void;
  onToggleEdit: () => void;
  onReset: () => void;
  onUpload: () => void;
  onCancelUpload: () => void;
}