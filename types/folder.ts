export interface UpdateFolderPayload {
  folderId: string;
  name?: string;
  encryptedMetadata?: {
    nonce: string;
    ciphertext: string;
  };
  parentId?: string | null;
  isFavorite?: boolean;
}

export type GetAllFolders = {
  id: string;
  name: string;
  isFavorite: boolean;
  isEncrypted: boolean;
  encryptedMetadataNonce: string | null;
  encryptedMetadataCiphertext: string | null;
}[];
