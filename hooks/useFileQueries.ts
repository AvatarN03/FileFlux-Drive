import { useQuery } from "@tanstack/react-query";

import { fileApi } from "./useFileMutations";

import {  FileQueryParams } from "@/types/file";

export function useFiles(params: FileQueryParams) {
  const { folderId, search, category } = params;

  return useQuery({
    queryKey: [
      "files",
      {
        folderId: folderId ?? null,
        search: search ?? "",
        category: category ?? "all",
      },
    ],

    queryFn: () => fileApi.getFiles(params),

    placeholderData: (prev) => prev,
  });
}

export function useFile(fileId?: string) {
  return useQuery({
    queryKey: ["file", fileId],

    queryFn: () => fileApi.getFile(fileId!),

    enabled: !!fileId,
  });
}

// export function useRecentFiles() {
//   return useQuery({
//     queryKey: ["files", "recent"],

//     queryFn: () => fileApi.getRecentFiles(),
//   });
// }

// export function useTrashFiles() {
//   return useQuery({
//     queryKey: ["files", "trash"],

//     queryFn: () => fileApi.getTrashFiles(),
//   });
// }

// export function useFavorites() {
//   return useQuery({
//     queryKey: ["files", "favorites"],

//     queryFn: () => fileApi.getFavoriteFiles(),
//   });
// }

// export function useStorage() {
//   return useQuery({
//     queryKey: ["storage"],

//     queryFn: () => fileApi.getStorage(),
//   });
// }

// export function useSharedFile(shareId?: string) {
//   return useQuery({
//     queryKey: ["shared-file", shareId],

//     queryFn: () => fileApi.getSharedFile(shareId!),

//     enabled: !!shareId,
//   });
// }