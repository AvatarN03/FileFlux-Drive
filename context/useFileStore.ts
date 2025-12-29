// context/useFile.ts
import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import toastC from "@/lib/toast";
import { FileItem, FileState, FolderItem } from "@/types/file";
import buildQueryParams from "@/lib/queryParams";
import handleError from "@/lib/file/handleErrors";
import { FetchParams } from "@/types/ui";





const useFileStore = create<FileState>()(
  devtools(
    (set, get) => ({
      files: [],
      folders: [],
      loading: false,
      error: null,
      storage: null,

      // ============================================
      // SETTERS
      // ============================================

      setFiles: (files) => set({ files }, false, "setFiles"),
      
      setFolders: (folders) => set({ folders }, false, "setFolders"),

      addFile: (file: FileItem) =>
        set(
          (state) => ({
            files: [...state.files, file],
          }),
          false,
          "addFile"
        ),

      // ============================================
      // STORAGE
      // ============================================

      checkStorage: async () => {
        try {
          const res = await axios.get("/api/files/checkStorage");
          set({ storage: res.data }, false, "checkStorage/success");
        } catch (error) {
          console.error("Failed to check storage:", error);
          set({ storage: null }, false, "checkStorage/error");
        }
      },

      // ============================================
      // FILE OPERATIONS
      // ============================================

      fetchFiles: async (params: FetchParams = {}) => {
        set({ loading: true }, false, "fetchFiles/start");
        
        try {
          const queryParams = buildQueryParams(params);
          const url = `/api/files/getFiles${queryParams}`;

          const res = await axios.get(url);

          set(
            {
              files: res.data.files,
              loading: false,
              error: null,
            },
            false,
            "fetchFiles/success"
          );
        } catch (error) {
          set({ loading: false }, false, "fetchFiles/error");
          handleError(error, "Failed to fetch files");
        }
      },

      deleteFile: async ({ fileId, folderId }) => {
        try {
          await axios.delete("/api/files", {
            data: { fileId, folderId },
          });

          // Batch updates to reduce re-renders
          await Promise.all([
            get().fetchFiles({ folderId: folderId ?? undefined }),
            get().fetchFolders({ folderId: folderId ?? undefined }),
            get().checkStorage(),
          ]);

          toastC({
            type: "success",
            data: "File deleted successfully",
          });
        } catch (error) {
          handleError(error, "Failed to delete file");
        }
      },

      renameFile: async (args) => {
        if (!args) return;

        const { fileId, newName, folderId } = args;

        if (!newName.trim()) {
          toastC({
            type: "error",
            data: "File name cannot be empty",
          });
          return;
        }

        try {
          await axios.patch("/api/files", {
            fileId,
            file_name: newName,
          });

          // Optimistic update
          set(
            (state) => ({
              files: state.files.map((file) =>
                file.id === fileId ? { ...file, file_name: newName } : file
              ),
            }),
            false,
            "renameFile/optimistic"
          );

          // Fetch to ensure sync with backend
          await get().fetchFiles({ folderId });

          toastC({
            type: "success",
            data: "File renamed successfully",
          });
        } catch (error) {
          // Revert optimistic update on error
          await get().fetchFiles({ folderId });
          handleError(error, "Failed to rename file");
        }
      },

      moveFile: async ({ fileId, moveToFolderId, folderId }) => {
        try {
          await axios.patch("/api/files/move", {
            fileId,
            folderId: moveToFolderId,
          });

          // Batch updates
          await Promise.all([
            get().fetchFiles({ folderId }),
            get().fetchFolders({ folderId }),
          ]);

          toastC({
            type: "success",
            data: "File moved successfully",
          });
        } catch (error) {
          handleError(error, "Failed to move file");
        }
      },

      // ============================================
      // FOLDER OPERATIONS
      // ============================================

      addFolder: async ({ folderId, newFolder }) => {
        if (!newFolder.trim()) {
          toastC({
            type: "error",
            data: "Folder name cannot be empty",
          });
          return;
        }

        try {
          const res = await axios.post("/api/folders", {
            name: newFolder,
            parentId: folderId ?? null,
          });

          const folder = res.data.folder;

          set(
            (state) => ({
              folders: [...state.folders, folder],
            }),
            false,
            "addFolder"
          );

          toastC({
            type: "success",
            data: "Folder created successfully",
          });
        } catch (error) {
          handleError(error, "Failed to add folder");
        }
      },

      updateFolder: async ({ folderId, editName }) => {
        if (!editName.trim()) {
          toastC({
            type: "error",
            data: "Folder name cannot be empty",
          });
          return;
        }

        try {
          const res = await axios.patch("/api/folders", {
            folderId,
            name: editName,
          });

          const updatedFolder = res.data.folder;

          // Optimistic update
          set(
            (state) => ({
              folders: state.folders.map((folder) =>
                folder.id === folderId ? updatedFolder : folder
              ),
            }),
            false,
            "updateFolder"
          );

          toastC({
            type: "success",
            data: "Folder renamed successfully",
          });
        } catch (error) {
          // Revert on error
          await get().fetchFolders();
          handleError(error, "Failed to update folder");
        }
      },

      moveFolder: async ({ folderId, parentId }) => {
        try {
          const res = await axios.patch("/api/folders", {
            folderId,
            parentId,
          });

          const updatedFolder = res.data.folder;

          set(
            (state) => ({
              folders: state.folders.map((folder) =>
                folder.id === folderId ? updatedFolder : folder
              ),
            }),
            false,
            "moveFolder"
          );

          toastC({
            type: "success",
            data: "Folder moved successfully",
          });

          await get().fetchFolders();
        } catch (error) {
          handleError(error, "Failed to move folder");
        }
      },

      deleteFolder: async ({ folderId }) => {
        try {
          await axios.delete("/api/folders", {
            data: { folderId },
          });

          // Batch updates
          await Promise.all([
            get().fetchFolders({ folderId: undefined }),
            get().fetchFiles({ folderId: undefined }),
            get().checkStorage(),
          ]);

          toastC({
            type: "success",
            data: "Folder deleted successfully",
          });
        } catch (error) {
          handleError(error, "Failed to delete folder");
        }
      },

      fetchFolders: async (params: FetchParams = {}) => {
        set({ loading: true }, false, "fetchFolders/start");
        
        try {
          const queryParams = buildQueryParams(params);
          const url = `/api/folders${queryParams}`;

          const res = await axios.get(url);
          const folders: FolderItem[] = res.data.folders;

          set(
            {
              folders,
              loading: false,
              error: null,
            },
            false,
            "fetchFolders/success"
          );
        } catch (error) {
          set({ loading: false }, false, "fetchFolders/error");
          handleError(error, "Failed to fetch folders");
        }
      },

      getAllFolders: async () => {
        try {
          const res = await axios.get("/api/folders/getAll");
          return res.data.allFolders;
        } catch (error) {
          handleError(error, "Failed to fetch all folders");
          return [];
        }
      },
    }),
    {
      name: "file-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);


export default useFileStore;