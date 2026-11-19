// Shared file mutation payloads
export interface UpdateFilePayload {
  fileId: string;
  name?: string;
  extension?: string;
  isFavorite?: boolean;
}

export interface MoveFilePayload {
  fileId: string;
  toFolderId: string | null;
}

export interface DeleteFilePayload {
  fileId: string;
}

export interface RestoreFilePayload {
  fileId: string;
}

// Shared file models
interface FileFolder {
  id: string;
  name: string;
  color: string | null;
}

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  url?: string;
  thumbnailUrl: string | null;
  folderId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  folder: FileFolder | null;
  downloads?: number;
  views?: number;
  lastOpenedAt?: string | null;
  isEncrypted?: boolean;
  objectKey?: string | null;
  streamHeader?: string | null;
  encryptedKeyNonce?: string | null;
  encryptedKeyCiphertext?: string | null;
  encryptedMetadataNonce?: string | null;
  encryptedMetadataCiphertext?: string | null;
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
  updatedAt: string;
  folder: FileFolder | null;
  downloads?: number;
  views?: number;
  lastOpenedAt?: string | null;
}

// Shared file filtering and query types
export type FileCategoryFilter =
  | "all"
  | "image"
  | "video"
  | "document"
  | "spreadsheet"
  | "other";

export interface FileQueryParams {
  folderId?: string | null;
  search?: string;
  category?: FileCategoryFilter;
}
