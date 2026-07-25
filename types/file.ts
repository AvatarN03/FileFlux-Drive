
// FileUpload Component Type
export type UploadState = {
  file: File | null;
  fileName: string;
  isEditingFileName: boolean;
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
};

// File Mutations hook types

//upload file api
export interface UploadFilePayload {
  file: File;
  folderId?: string | null;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

// update file api
export interface UpdateFilePayload {
  fileId: string;
  name?: string;
  extension?: string;
  isFavorite?: boolean;
}

// move file api
export interface MoveFilePayload {
  fileId: string;
  fromFolderId?: string | null;
  toFolderId?: string | null;
}

// trash file api
export interface DeleteFilePayload {
  fileId: string;
}

// restore file api
export interface RestoreFilePayload {
  fileId: string;
}

// download file api
export interface DownloadFilePayload {
  fileId: string;
}

// ---



// export interface FileListItem {
//   id: string;
//   name: string;
//   extension: string;
//   mimeType: string;
//   size: number;
//   thumbnailUrl: string | null;
//   folderId: string | null;
//   isFavorite: boolean;
//   createdAt: Date;

//   folder: {
//     id: string;
//     name: string;
//     color: string | null;
//     icon: string | null;
//   } | null;
// }


// File Type (General)
//TODO: fix the fileItem type
export interface FileFolder {
  id: string;
  name: string;
  color:string;
}
export interface FileItem {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  thumbnailUrl: string | null;
  folderId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt:string;
  folder: FileFolder | null;
}

export interface FilesResponse {
  id: string;
  name: string;
  size: number;
  thumbnailUrl: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt:string;
  folder: FileFolder | null;
}

export interface FileDetail {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  thumbnailUrl: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt:string;
  folder: FileFolder | null;
}

// File Category Filter type
export type FileCategoryFilter =
  | "all"
  | "image"
  | "video"
  | "document"
  | "spreadsheet"
  | "other";

//TODO: fix this type
// File Provider Context Actions type
export type ModalMode = "preview" | "details" | "edit" | "move" | null;

export interface FileModalState {
  mode: ModalMode;
  file: FileItem | null;
}

export interface FileModalContextValue extends FileModalState {
  openModal: (mode: Exclude<ModalMode, null>, file: FileItem) => void;
  closeModal: () => void;
}

export interface FileActionHandlers {
  onEdit?: (file: FileItem) => void;
  onToggleFavorite?: (file: FileItem) => void;
  onMove?: (file: FileItem) => void;
  onDetails?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
}

// --- 


// Individual File Query hook type
export interface FileQueryParams {
  folderId?: string | null;
  search?: string;
  category?: FileCategoryFilter;
}


