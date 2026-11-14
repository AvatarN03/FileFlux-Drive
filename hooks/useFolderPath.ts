import { useQuery } from "@tanstack/react-query";

import { decryptFolderMetadata } from "@/lib/crypto";
import { useVault } from "@/context/VaultContext";

type FolderPathItem = {
  id: string;
  name: string;
  isEncrypted: boolean;
  encryptedMetadataNonce: string | null;
  encryptedMetadataCiphertext: string | null;
};

export function useFolderPath(folderId: string | null) {
  const { vaultKey } = useVault();

  return useQuery({
    queryKey: ["folders", "path", folderId, vaultKey !== null],
    enabled: !!folderId,
    queryFn: async (): Promise<FolderPathItem[]> => {
      const response = await fetch(
        `/api/folders/path?folderId=${encodeURIComponent(folderId!)}`,
      );
      const result = (await response.json()) as {
        success: boolean;
        path?: FolderPathItem[];
      };

      if (!response.ok || !result.success || !result.path) {
        throw new Error("Failed to load folder path.");
      }

      return Promise.all(
        result.path.map(async (folder) => {
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
}
