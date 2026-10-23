"use client";

import React, { useRef, useState, ChangeEvent, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";

import UploadArea from "./files/UploadArea";
import FilePreview from "./files/FilePreview";

import { useAuth } from "@/hooks/useAuth";
import { useFileMutations } from "@/hooks/useFileMutations";
import { useVault } from "@/context/VaultContext";
import { useQueryClient } from "@tanstack/react-query";
import { uploadEncryptedFile } from "@/lib/storage/encryptedFileTransfer";

import { toastError, toastSuccess } from "@/lib/toast";
import { createRenamedFile, getFileNameWithoutExtension } from "@/lib/file/operations";

import { INITIAL_STATE } from "@/constant";

import { UploadState } from "@/types/file";
import { canUploadFile } from "@/lib/validations/file";

const FileUpload = () => {
  const [state, setState] = useState<UploadState>(INITIAL_STATE);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const router = useRouter();
  const { folderId } = useParams<{
    folderId?: string;
  }>();

  const { user } = useAuth();
  const { vaultKey } = useVault();
  const queryClient = useQueryClient();
  const { upload } = useFileMutations();

  const updateState = useCallback((updates: Partial<UploadState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    abortControllerRef.current = null;
  }, []);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      if (state.isUploading) return;
      const fileName = getFileNameWithoutExtension(selectedFile);
      updateState({
        file: selectedFile,
        fileName,
        uploadProgress: 0,
        uploadComplete: false,
        isEditingFileName: false,
      });
    },
    [updateState, state.isUploading]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (state.isUploading) return;
      const selected = e.target.files?.[0];
      if (selected) {
        handleFileSelect(selected);
      }
    },
    [handleFileSelect, state.isUploading]
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
      if (state.isUploading) return;
      const dropped = e.dataTransfer.files[0];

      if (dropped) {
        handleFileSelect(dropped);
      }

      updateState({ isDragging: false });
    },
    [handleFileSelect, updateState, state.isUploading]
  );

  const handleUpload = useCallback(async () => {
    if (!state.file || !user) return;

    // Storage check
    if (canUploadFile(state.file, user) === false) {
      toastError("Storage limit exceeded.");
      return;
    }

    if (!state.fileName.trim()) {
      toastError("Filename cannot be empty");
      return;
    }

    if (!vaultKey) {
      toastError("Please unlock your secure vault before uploading files.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      updateState({
        isUploading: true,
      });

      const renamedFile = createRenamedFile(
        state.file,
        state.fileName.trim()
      );

      // Perform client-side authenticated encryption and direct Neon S3 upload
      await uploadEncryptedFile({
        file: renamedFile,
        displayName: state.fileName.trim(),
        folderId,
        vaultKey,
        signal: controller.signal,
        onProgress: (progress) => {
          updateState({ uploadProgress: progress });
        },
      });

      updateState({
        uploadComplete: true,
        uploadProgress: 100,
      });

      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toastSuccess("File encrypted and stored securely!");

      timeoutRef.current = setTimeout(resetState, 1000);
    } catch (error) {
      console.error(error);
      if (axios.isCancel(error) || (error as { code?: string })?.code === "ERR_CANCELED") {
        resetState();
        return;
      }

      toastError((error as Error)?.message || "Failed to upload file");

      resetState();
    } finally {
      abortControllerRef.current = null;
    }
  }, [
    state.file,
    state.fileName,
    user,
    folderId,
    vaultKey,
    queryClient,
    updateState,
    resetState,
  ]);

  const handleCancelUpload = useCallback(() => {
    abortControllerRef.current?.abort();
    // resetState() also runs in the catch block above once the
    // aborted request rejects, but we flip isUploading immediately
    // so the UI feels instant rather than waiting on the promise.
    updateState({ isUploading: false, uploadProgress: 0 });
  }, [updateState]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  if (!user || !user.emailVerified) {
    return (
      <div className="">
        <h1>Please verify your email address to upload files.</h1>
        <button onClick={() => router.push("/verify-email")} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Resend Verification Email

        </button>
      </div>
    )
  }

  return (
    <div className="relative max-w-92 w-full mx-auto min-h-64  rounded-md p-2 ">
      <div className="w-full rounded-xl p-2 bg-brown h-full flex flex-col">

        <h1 className="text-violet text-center text-xl md:text-2xl font-medium border-b-violet border-b-2 max-w-64 shadow-xl mx-auto">
          Upload
        </h1>

        <div
          className={`relative border-2 border-dashed rounded-xl p-1 w-full cursor-pointer transition-colors flex-1
            ${state.isDragging ? "border-ember bg-ember/5" : "border-brown"}
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
              onCancelUpload={handleCancelUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
