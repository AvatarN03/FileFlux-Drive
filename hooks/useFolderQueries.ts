import { useQuery } from "@tanstack/react-query";

import { useVault } from "@/context/VaultContext";

import { decryptFolderMetadata } from "@/lib/crypto";
import folderApi from "@/services/folderApi";

import type { AllFolderItem } from "@/types/folder";

export const useFoldersAll = (parentId?: string | null) => {
  const { vaultKey } = useVault();

  return useQuery({
    queryKey: ["folders", parentId, vaultKey !== null],
    queryFn: async () => {
      const folders = (await folderApi.getAll(parentId)) ?? [];

      return Promise.all(
        folders.map(async (folder) => {
          if (!folder.isEncrypted) return folder;

          if (!vaultKey || !folder.encryptedMetadataNonce || !folder.encryptedMetadataCiphertext) {
            return { ...folder, name: "[Encrypted Folder]" };
          }

          try {
            const metadata = await decryptFolderMetadata(
              {
                nonce: folder.encryptedMetadataNonce,
                ciphertext: folder.encryptedMetadataCiphertext,
              },
              vaultKey
            );
            return { ...folder, name: metadata.name };
          } catch {
            return { ...folder, name: "[Unable to decrypt folder]" };
          }
        })
      );
    },
  });
};

export const useAllFolders = () => {
  const { vaultKey } = useVault();

  return useQuery({
    queryKey: ["folders", "all", vaultKey !== null],
    queryFn: async () => {
      const folders = (await folderApi.getAllFolders()) ?? [];

      return Promise.all(
        folders.map(async (folder): Promise<AllFolderItem> => {
          if (!folder.isEncrypted) return folder;

          if (
            !vaultKey ||
            !folder.encryptedMetadataNonce ||
            !folder.encryptedMetadataCiphertext
          ) {
            return { ...folder, name: "[Encrypted Folder]" };
          }

          try {
            const metadata = await decryptFolderMetadata(
              {
                nonce: folder.encryptedMetadataNonce,
                ciphertext: folder.encryptedMetadataCiphertext,
              },
              vaultKey
            );
            return { ...folder, name: metadata.name };
          } catch {
            return { ...folder, name: "[Unable to decrypt folder]" };
          }
        })
      );
    },
  });
};

export const useTrashFolders = () => {
  const { vaultKey } = useVault();

  return useQuery({
    queryKey: ["trash-folders", vaultKey !== null],
    queryFn: async () => {
      const folders = await folderApi.getTrash();

      return Promise.all(
        folders.map(async (folder) => {
          if (!folder.isEncrypted) return folder;

          if (
            !vaultKey ||
            !folder.encryptedMetadataNonce ||
            !folder.encryptedMetadataCiphertext
          ) {
            return { ...folder, name: "[Encrypted Folder]" };
          }

          try {
            const metadata = await decryptFolderMetadata(
              {
                nonce: folder.encryptedMetadataNonce,
                ciphertext: folder.encryptedMetadataCiphertext,
              },
              vaultKey,
            );
            return { ...folder, name: metadata.name };
          } catch {
            return { ...folder, name: "[Unable to decrypt folder]" };
          }
        }),
      );
    },
  });
};
