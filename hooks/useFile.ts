

import { useQuery } from "@tanstack/react-query";
import { fileApi } from "./useFileMutations";




export function useFiles(folderId?: string | null) {
  return useQuery({
    queryKey: folderId
      ? ["folder-files", folderId]
      : ["files"],

    queryFn: () => fileApi.getFiles(folderId),
  });
}

/*
Future

export function useRecentFiles() {}

export function useTrashFiles() {}

export function useFavorites() {}

export function useStorage() {}

export function useSharedFile(shareId: string) {}
*/



