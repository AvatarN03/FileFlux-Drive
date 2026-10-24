import folderApi from "@/services/folderApi";
import { useQuery } from "@tanstack/react-query";


export const useFoldersAll = (parentId?: string | null) => {
  return useQuery({
    queryKey: ["folders", parentId],
    queryFn: () => folderApi.getAll(parentId),
  });
};