import { FetchParams } from "@/types/ui";

const buildQueryParams = (params: FetchParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.folderId !== undefined) {
    searchParams.append("folderId", params.folderId.toString());
  }
  
  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export default buildQueryParams;