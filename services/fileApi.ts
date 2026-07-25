import axios, { AxiosProgressEvent } from "axios";

import { ApiResponse } from "@/types";
import {
  DeleteFilePayload,
  DownloadFilePayload,
  FileDetail,
  FileQueryParams,
  FilesResponse,
  MoveFilePayload,
  RestoreFilePayload,
  UpdateFilePayload,
  UploadFilePayload,
} from "@/types/file";

import { FILE_API_ENDPOINTS } from "@/constant";

const fileApi = {
  async upload({ file, folderId, onProgress, signal }: UploadFilePayload) {
    const formData = new FormData();

    formData.append("fileUpload", file);

    if (folderId) {
      formData.append("folderId", folderId);
    }

    const { data } = await axios.post<ApiResponse>(
      FILE_API_ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;

          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          onProgress?.(progress);
        },
      },
    );

    if (!data.success) {
      throw new Error(data.error ?? "Upload failed");
    }

    return data;
  },

  async getFiles({
    folderId,
    search,
    category,
  }: FileQueryParams): Promise<FilesResponse[]> {
    const params = new URLSearchParams();

    if (folderId) {
      params.set("folderId", folderId);
    }

    if (search) {
      params.set("search", search);
    }

    if (category && category !== "all") {
      params.set("category", category);
    }

    const res = await fetch(`${FILE_API_ENDPOINTS.GET}?${params.toString()}`);

    const data: ApiResponse<FilesResponse[]> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch files");
    }

    return data.data!;
  },

  async getFile(fileId: string): Promise<FileDetail> {
    const res = await fetch(`${FILE_API_ENDPOINTS.GET}/${fileId}`);

    const data: ApiResponse<FileDetail> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch file");
    }

    return data.data!;
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
    const res = await fetch(`${FILE_API_ENDPOINTS.MOVE}/${fileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folderId: toFolderId,
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

  async download({ fileId }: DownloadFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.DOWNLOAD}/${fileId}`, {
      method: "POST",
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to download file");
    }

    return data;
  },
};

export default fileApi;