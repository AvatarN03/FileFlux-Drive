export const FOLDER_COLOR_OPTIONS = [
  { value: "#BA5624", label: "Terracotta" },
  { value: "#381D2A", label: "Violet" },
  { value: "#D97706", label: "Amber" },
  { value: "#059669", label: "Emerald" },
  { value: "#2563EB", label: "Blue" },
  { value: "#9333EA", label: "Purple" },
] as const;

export type FolderColor = (typeof FOLDER_COLOR_OPTIONS)[number]["value"];

export interface UpdateFolderPayload {
  folderId: string;
  name?: string;
  encryptedMetadata?: {
    nonce: string;
    ciphertext: string;
  };
  parentId?: string | null;
  color?: string | null;
  isFavorite?: boolean;
}

export type GetAllFolders = {
  id: string;
  name: string;
  color: string | null;
  isFavorite: boolean;
  isEncrypted: boolean;
  encryptedMetadataNonce: string | null;
  encryptedMetadataCiphertext: string | null;
}[];

export type AllFolderItem = {
  id: string;
  name: string;
  parentId: string | null;
  color: string | null;
  isFavorite: boolean;
  isEncrypted: boolean;
  encryptedMetadataNonce: string | null;
  encryptedMetadataCiphertext: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrashFolder = {
  id: string;
  name: string;
  parentId: string | null;
  isEncrypted: boolean;
  encryptedMetadataNonce: string | null;
  encryptedMetadataCiphertext: string | null;
  deletedAt: string;
};
