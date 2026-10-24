import { ApiResponse } from "@/types";
import { CreateFolderPayload, GetAllFolders, UpdateFolderPayload } from "@/types/folder";

const folderApi = {
  create: async (payload: CreateFolderPayload) => {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to create folder");
    }

    return data;
  },

  getAll: async (parentId?: string | null) => {
    const url = parentId
      ? `/api/folders?folderId=${parentId}`
      : "/api/folders";

    const res = await fetch(url);

    const data: ApiResponse<GetAllFolders> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch folders");
    }

    console.log("Fetched folders:", data);

    return data.data;
  },

   // Rename / Move folder
  update: async (payload: UpdateFolderPayload) => {
    const res = await fetch("/api/folders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to update folder");
    }

    return data;
  },

  // Delete folder
  delete: async (folderId: string) => {
    const res = await fetch("/api/folders", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId }),
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to delete folder");
    }

    return data;
  },
};

export default folderApi;
