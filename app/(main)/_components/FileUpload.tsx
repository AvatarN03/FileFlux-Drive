// components/FileUpload/FileUpload.tsx
"use client";

import React, { useRef, useState, ChangeEvent, useCallback } from "react";
import { useParams } from "next/navigation";

import axios from "axios";

import { toastError } from "@/lib/toast";
import useFileStore from "@/context/useFileStore";
import getFileNameWithoutExtension from "@/lib/file/getFileNameWithoutExtension";
import createRenamedFile from "@/lib/file/createRenamedFile";
import UploadArea from "./files/UploadArea";
import FilePreview from "./files/FilePreview";
import { UploadState } from "@/types/ui";
import { API_ENDPOINTS } from "@/constant";

const INITIAL_STATE: UploadState = {
  file: null,
  fileName: "",
  isEditingFileName: false,
  isDragging: false,
  isUploading: false,
  uploadProgress: 0,
  uploadComplete: false,
};

const FileUpload = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>(INITIAL_STATE);

  const { addFile, checkStorage } = useFileStore();
  const params = useParams();
  const folderId = params.folderId ? Number(params.folderId) : null;

  const updateState = useCallback((updates: Partial<UploadState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, []);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      const fileName = getFileNameWithoutExtension(selectedFile);
      updateState({
        file: selectedFile,
        fileName,
        uploadProgress: 0,
        uploadComplete: false,
        isEditingFileName: false,
      });
    },
    [updateState]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) {
        handleFileSelect(selected);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      updateState({ isDragging: true });
    },
    [updateState]
  );

  const handleDragLeave = useCallback(() => {
    updateState({ isDragging: false });
  }, [updateState]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];

      if (dropped) {
        handleFileSelect(dropped);
      }

      updateState({ isDragging: false });
    },
    [handleFileSelect, updateState]
  );

  const checkStorageAvailability = async (
    fileSize: number
  ): Promise<boolean> => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.CHECK_STORAGE, {
        params: { size: fileSize },
      });

      if (!data.canUpload) {
        toastError("Storage limit exceeded");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Storage check failed:", error);
      toastError("Failed to check storage availability");
      return false;
    }
  };

  const handleUpload = useCallback(async () => {
    if (!state.file) return;

    // Check storage before uploading
    const canUpload = await checkStorageAvailability(state.file.size);
    if (!canUpload) {
      resetState();
      return;
    }

    // Prepare file and form data
    const renamedFile = createRenamedFile(state.file, state.fileName);
    const formData = new FormData();
    formData.append("file", renamedFile);

    if (folderId) {
      formData.append("folderId", folderId.toString());
    }

    try {
      updateState({ isUploading: true, uploadProgress: 0 });

      const { data } = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateState({ uploadProgress: progress });
          }
        },
      });

      // Update store
      addFile(data.file);
      await checkStorage();

      // Show completion briefly, then reset
      updateState({ uploadComplete: true });

      setTimeout(() => {
        resetState();
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toastError("Failed to upload file");
      resetState();
    }
  }, [
    state.file,
    state.fileName,
    folderId,
    addFile,
    checkStorage,
    updateState,
    resetState,
  ]);

  return (
    <div className="max-w-92 w-full mx-auto h-auto rounded-xl p-2 md:p-3 bg-ember">
      <div className="w-full rounded-xl p-3 bg-peach">
        <h1 className="text-violet text-center text-xl md:text-2xl my-2 font-medium border-b-violet border-b-2 max-w-64 shadow-xl mx-auto">
          Upload
        </h1>

        <div
          className={`relative border-2 border-dashed rounded-xl p-1 md:p-2 w-full cursor-pointer transition-colors
            ${state.isDragging ? "border-ember bg-ember/5" : "border-gray-300"}
          `}
          onClick={() => !state.file && fileRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={handleFileChange}
            disabled={state.isUploading}
          />

          {!state.file ? (
            <UploadArea />
          ) : (
            <FilePreview
              file={state.file}
              fileName={state.fileName}
              isEditingFileName={state.isEditingFileName}
              isUploading={state.isUploading}
              uploadProgress={state.uploadProgress}
              uploadComplete={state.uploadComplete}
              onFileNameChange={(name: string) =>
                updateState({ fileName: name })
              }
              onToggleEdit={() =>
                updateState({ isEditingFileName: !state.isEditingFileName })
              }
              onReset={resetState}
              onUpload={handleUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
