import { FILE_API_ENDPOINTS } from "@/constant";
import {
  DeleteFilePayload,
  DownloadFilePayload,
  MoveFilePayload,
  RestoreFilePayload,
  UpdateFilePayload,
  UploadFilePayload,
} from "@/types/file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";

export const fileApi = {
  async upload({ file, folderId, onProgress, signal }: UploadFilePayload) {
    const formData = new FormData();

    formData.append("fileUpload", file);

    if (folderId) {
      formData.append("folderId", folderId);
    }

    const { data } = await axios.post(FILE_API_ENDPOINTS.UPLOAD, formData, {
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
    });

    return data;
  },

  async getFiles(folderId?: string | null) {
    const params = new URLSearchParams();

    if (folderId) {
      params.set("folderId", folderId);
    }

    const res = await fetch(`${FILE_API_ENDPOINTS.GET}?${params.toString()}`);

    return res.json();
  },

  async update({ fileId, ...payload }: UpdateFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.UPDATE}/${fileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

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

    const data = await res.json();
    return data;
  },

  async delete({ fileId }: DeleteFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.DELETE}/${fileId}`, {
      method: "DELETE",
    });
    const data = await res.json();

    return data;
  },

  async restore({ fileId }: RestoreFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.RESTORE}/${fileId}`, {
      method: "PATCH",
    });

    const data = await res.json();

    return data;
  },

  async download({ fileId }: DownloadFilePayload) {
    const res = await fetch(`${FILE_API_ENDPOINTS.DOWNLOAD}/${fileId}`, {
      method: "POST",
    });

    const data = await res.json();

    return data;
  },
};

export function useFileMutations() {
  const queryClient = useQueryClient();

  const invalidateUpload = (folderId?: string | null) => {
    queryClient.invalidateQueries({
      queryKey: ["files"],
    });

    queryClient.invalidateQueries({
      queryKey: ["recent-files"],
    });

    queryClient.invalidateQueries({
      queryKey: ["storage"],
    });

    if (folderId) {
      queryClient.invalidateQueries({
        queryKey: ["folder-files", folderId],
      });
    }
  };

  const upload = useMutation({
    mutationFn: (payload: UploadFilePayload) => fileApi.upload(payload),

    onSuccess: (_, variables) => {
      invalidateUpload(variables.folderId);
    },
  });

  const update = useMutation({
    mutationFn: (payload: UpdateFilePayload) => fileApi.update(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-files"],
      });
    },
  });

  const move = useMutation({
    mutationFn: (payload: MoveFilePayload) => fileApi.move(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      if (variables.fromFolderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder-files", variables.fromFolderId],
        });
      }

      if (variables.toFolderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder-files", variables.toFolderId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["recent-files"],
      });
    },
  });

  const remove = useMutation({
    mutationFn: (payload: DeleteFilePayload) => fileApi.delete(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trash-files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["storage"],
      });

      if (variables.folderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder-files", variables.folderId],
        });
      }
    },
  });

  const restore = useMutation({
    mutationFn: (payload: RestoreFilePayload) => fileApi.restore(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trash-files"],
      });

      if (variables.folderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder-files", variables.folderId],
        });
      }
    },
  });

  const download = useMutation({
    mutationFn: (payload: DownloadFilePayload) => fileApi.download(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });
    },
  });

  return {
    upload,
    update,
    move,
    remove,
    restore,
    download,
  };
}
