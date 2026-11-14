

export type CreateFolderPayload = {
    name: string;
    parentId?: string | null;
};

export type CreateEncryptedFolderPayload = {
  encryptedMetadata: {
    nonce: string;
    ciphertext: string;
  };
  parentId?: string | null;
};

export type AddFolderModalProps = {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
    onClose: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isPending: boolean;
    title?: string;
    submitLabel?: string;
};

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
    name:string;
    isFavorite: boolean;
    isEncrypted: boolean;
    encryptedMetadataNonce: string | null;
    encryptedMetadataCiphertext: string | null;
}[]

export type FolderItem = {
    id: string;
    name: string;
    isFavorite: boolean;
}

export type FolderModalMode = "details" | "edit" | "move" | "delete" | null;


export interface FolderModalState {
  mode: FolderModalMode;
  folder: FolderItem | null;
}

export interface FolderModalContextValue extends FolderModalState {
  openModal: (
    mode: Exclude<FolderModalMode, null>,
    folder: FolderItem
  ) => void;
  closeModal: () => void;
}
