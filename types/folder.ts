

export type CreateFolderPayload = {
    name: string;
    parentId?: string | null;
};

export type AddFolderModalProps = {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
    onClose: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isPending: boolean;
};

export interface UpdateFolderPayload {
  folderId: string;
  name?: string;
  parentId?: string | null;
}

export type GetAllFolders = {
    id: string;
    name:string;
    isFavorite: boolean;
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