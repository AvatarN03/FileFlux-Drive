import { useMutation, useQueryClient } from "@tanstack/react-query";

import fileApi from "@/services/fileApi";

import {
  DeleteFilePayload,
  MoveFilePayload,
  RestoreFilePayload,
  UpdateFilePayload,
} from "@/types/file";

export function useFileMutations() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: (payload: UpdateFilePayload) => fileApi.update(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-files"],
      });

      if (variables.fileId) {
        queryClient.invalidateQueries({
          queryKey: ["file", variables.fileId],
        });
      }
    },
  });

  const move = useMutation({
    mutationFn: (payload: MoveFilePayload) => fileApi.move(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"],
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
        queryKey: ["recent-files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trash-files"],
      });

      queryClient.invalidateQueries({
        queryKey: ["storage"],
      });

      if (variables.fileId) {
        queryClient.invalidateQueries({
          queryKey: ["file", variables.fileId],
        });
      }
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

  return {
    update,
    move,
    remove,
    restore,
  };
}
