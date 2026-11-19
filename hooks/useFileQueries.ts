import { useQuery } from "@tanstack/react-query";

import fileApi from "@/services/fileApi";
import { useVault } from "@/context/VaultContext";
import { decryptMetadata } from "@/lib/crypto";
import { getFileCategoryFilter } from "@/lib/file/operations";
import { FileItem, FileQueryParams } from "@/types/file";

export function useFiles(params: FileQueryParams) {
  const { folderId, search, category } = params;
  const { vaultKey } = useVault();
  const isUnlocked = vaultKey !== null;

  return useQuery({
    queryKey: ["files", { folderId: folderId ?? null, isUnlocked }],
    queryFn: async () => {
      const files = await fileApi.getFiles({ folderId });

      return Promise.all(
        files.map(async (file): Promise<FileItem> => {
          if (!file.isEncrypted) return file;

          if (
            !vaultKey ||
            !file.encryptedMetadataNonce ||
            !file.encryptedMetadataCiphertext
          ) {
            return { ...file, name: "[Encrypted File]", extension: "" };
          }

          try {
            const metadata = await decryptMetadata(
              {
                nonce: file.encryptedMetadataNonce,
                ciphertext: file.encryptedMetadataCiphertext,
              },
              vaultKey
            );

            return {
              ...file,
              name: metadata.name,
              extension: metadata.extension,
            };
          } catch {
            return {
              ...file,
              name: "[Unable to decrypt file]",
              extension: "",
            };
          }
        })
      );
    },
    select: (files) => {
      const query = search?.trim().toLocaleLowerCase();

      return files.filter((file) => {
        if (
          query &&
          !file.name.toLocaleLowerCase().includes(query) &&
          !file.extension.toLocaleLowerCase().includes(query)
        ) {
          return false;
        }

        return !category || category === "all" || getFileCategoryFilter(file) === category;
      });
    },
  });
}

export function useFile(fileId?: string) {
  return useQuery({
    queryKey: ["file", fileId],

    queryFn: () => fileApi.getFile(fileId!),

    enabled: !!fileId,
  });
}

export function useTrashFiles() {
  const { vaultKey } = useVault();
  const isUnlocked = vaultKey !== null;

  return useQuery({
    queryKey: ["trash-files", { isUnlocked }],
    queryFn: async () => {
      const files = await fileApi.getTrashFiles();

      return Promise.all(
        files.map(async (file): Promise<FileItem> => {
          if (
            !file.isEncrypted ||
            !vaultKey ||
            !file.encryptedMetadataNonce ||
            !file.encryptedMetadataCiphertext
          ) {
            return file.isEncrypted
              ? { ...file, name: "[Encrypted File]", extension: "" }
              : file;
          }

          try {
            const metadata = await decryptMetadata(
              {
                nonce: file.encryptedMetadataNonce,
                ciphertext: file.encryptedMetadataCiphertext,
              },
              vaultKey,
            );

            return { ...file, name: metadata.name, extension: metadata.extension };
          } catch {
            return { ...file, name: "[Unable to decrypt file]", extension: "" };
          }
        }),
      );
    },
  });
}
