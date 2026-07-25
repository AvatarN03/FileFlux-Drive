import { useMutation, useQueryClient } from "@tanstack/react-query";

import fileApi from "@/services/fileApi";

import {
  DeleteFilePayload,
  DownloadFilePayload,
  MoveFilePayload,
  RestoreFilePayload,
  UpdateFilePayload,
  UploadFilePayload,
} from "@/types/file";

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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trash-files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["storage"],
      });
    },
  });

  const restore = useMutation({
    mutationFn: (payload: RestoreFilePayload) => fileApi.restore(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trash-files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-files"],
      });
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
