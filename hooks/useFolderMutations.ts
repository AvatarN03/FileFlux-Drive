import folderApi from "@/services/folderApi";
import { CreateFolderPayload, UpdateFolderPayload } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFolderCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFolderPayload) => folderApi.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.parentId],
      });
    },
  });
};

export const useFolderUpdate = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateFolderPayload) => folderApi.update(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["folders", variables.parentId],
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