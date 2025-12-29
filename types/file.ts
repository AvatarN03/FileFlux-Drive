import { files, folders } from "@/db/schema";
import { AxiosError } from "axios";
import { InferSelectModel } from "drizzle-orm";

type ID = number;

/* -------------------- */
/* Folder Types         */
/* -------------------- */

export type Folder = {
  id: ID;
  name: string;
  parentId: ID | null;
  user_id: ID;
  createdAt: Date;
  updatedAt: Date;
};

export type FolderItem = InferSelectModel<typeof folders> & {
  fileCount: number;
  totalSize: number;
};

export type FolderPathNode = {
  id: ID;
  name: string;
  parentId: ID | null;
};

/* -------------------- */
/* File Types           */
/* -------------------- */

export type PathNode = {
  id: ID;
  name: string;
};

export type FileItem = InferSelectModel<typeof files> & {
  public_id?: string;
  path?: PathNode[];
};

export interface RenameArgs {
  id: ID;
  name: string;
}

/* -------------------- */
/* Storage / State      */
/* -------------------- */

export type StorageInfo = {
  used: number;
  max: number;
  remaining: number;
  available: boolean;
};

export type FileState = {
  files: FileItem[];
  folders: FolderItem[];
  loading: boolean;
  error: AxiosError | null;
  storage: StorageInfo | null;

  /* Files */
  setFiles: (files: FileItem[]) => void;
  addFile: (file: FileItem) => void;
  renameFile: (args: {
    fileId: ID;
    newName: string;
    folderId?: ID;
  }) => Promise<void>;
  fetchFiles: (args?: { folderId?: ID; limit?: number }) => Promise<void>;
  moveFile: (args: {
    fileId: ID;
    moveToFolderId: ID;
    folderId?: ID;
  }) => Promise<void>;
  deleteFile: (args: { fileId: ID; folderId?: ID | null }) => Promise<void>;

  /* Folders */
  setFolders: (folders: FolderItem[]) => void;
  addFolder: (args: { folderId?: ID; newFolder: string }) => Promise<void>;
  moveFolder: (args: { folderId: ID; parentId?: ID }) => Promise<void>;
  fetchFolders: (args?: { folderId?: ID; limit?: number }) => Promise<void>;
  updateFolder: (args: {
    folderId: ID;
    editName: string;
  }) => Promise<void>;
  deleteFolder: (args: { folderId: ID }) => Promise<void>;

  /* Storage */
  checkStorage: () => Promise<void>;
  getAllFolders: () => Promise<FolderItem[]>;
};

export type FolderResponse = {
  id: ID;
  name: string;
  fileCount: number;
  totalSize: number;
};

export type UploadState = {
  file: File | null;
  fileName: string;
  isEditingFileName: boolean;
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
};
