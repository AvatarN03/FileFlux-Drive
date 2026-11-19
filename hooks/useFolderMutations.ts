import folderApi from "@/services/folderApi";
import type { UpdateFolderPayload } from "@/types/folder";
import { encryptFolderMetadata } from "@/lib/crypto";
import { useVault } from "@/context/VaultContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateFolderPayload = {
  name: string;
  parentId?: string | null;
};

export const useFolderCreate = () => {
  const queryClient = useQueryClient();
  const { vaultKey } = useVault();

  return useMutation({
    mutationFn: async (payload: CreateFolderPayload) => {
      if (!vaultKey) {
        throw new Error("Unlock your vault before creating an encrypted folder.");
      }

      const encryptedMetadata = await encryptFolderMetadata(
        { name: payload.name },
        vaultKey
      );

      return folderApi.create({
        encryptedMetadata,
        parentId: payload.parentId,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.parentId],
      });
    },
  });
};

export const useFolderUpdate = ()=>{
    const queryClient = useQueryClient();
    const { vaultKey } = useVault();

    return useMutation({
        mutationFn: async (payload: UpdateFolderPayload) => {
            if (payload.name !== undefined) {
                if (!vaultKey) {
                    throw new Error("Unlock your vault before renaming an encrypted folder.");
                }

                const encryptedMetadata = await encryptFolderMetadata(
                    { name: payload.name },
                    vaultKey
                );

                return folderApi.update({
                    folderId: payload.folderId,
                    encryptedMetadata,
                    parentId: payload.parentId,
                });
            }

            return folderApi.update(payload);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["folders"],
            });
        }
    });
}

export const useFolderDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderId: string) => folderApi.delete(folderId),
        onSuccess: (_, folderId) => {
            queryClient.invalidateQueries({
                queryKey: ["folders", folderId],
            });
        }
    });
}
