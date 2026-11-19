import { ApiResponse } from "@/types";
import {
  DeleteFilePayload,
  FileDetail,
  FileItem,
  FileQueryParams,
  MoveFilePayload,
  RestoreFilePayload,
  UpdateFilePayload,
} from "@/types/file";

import { FILE_API_ENDPOINTS } from "@/constant";

const fileApi = {
  async getFiles({ folderId }: FileQueryParams): Promise<FileItem[]> {
    const params = new URLSearchParams();

    if (folderId) {
      params.set("folderId", folderId);
    }

    const res = await fetch(`${FILE_API_ENDPOINTS.GET}?${params.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch files");
    }

    return (data.files ?? data.data ?? []) as FileItem[];
  },

  async getFile(fileId: string): Promise<FileDetail> {
    const res = await fetch(`${FILE_API_ENDPOINTS.ITEM}/${fileId}`);
    const data: ApiResponse<FileDetail> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch file");
    }

    return data.data!;
  },

  async getTrashFiles(): Promise<FileItem[]> {
    const res = await fetch("/api/files/trash");
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch trash");
    }

    return (data.files ?? []) as FileItem[];
  },

  async update({
    fileId,
    ...payload
  }: UpdateFilePayload): Promise<ApiResponse> {
    const res = await fetch(`${FILE_API_ENDPOINTS.UPDATE}/${fileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to update file");
    }

    return data;
  },

  async move({ fileId, toFolderId }: MoveFilePayload) {
    const res = await fetch(FILE_API_ENDPOINTS.MOVE, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId,
        folderId: toFolderId ?? null,
      }),
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to move file");
    }

    return data;
  },

  async delete({ fileId }: DeleteFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.DELETE}/${fileId}`, {
      method: "DELETE",
    });
    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to delete file");
    }

    return data;
  },

  async restore({ fileId }: RestoreFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.RESTORE}/${fileId}`, {
      method: "PATCH",
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to restore file");
    }

    return data;
  },
};

export default fileApi;
