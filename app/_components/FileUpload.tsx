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

    if (!user.emailVerified) {
      toastError("Please verify your email before uploading files.");
      return;
    }

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
      const isAbort =
        (error as Error)?.message === "Upload aborted" ||
        (error as DOMException)?.name === "AbortError" ||
        axios.isCancel(error) ||
        (error as { code?: string })?.code === "ERR_CANCELED";

      if (isAbort) {
        toastError("Upload canceled");
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
      <div className="p-4 bg-brand-cream-muted border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] text-center">
        <h2 className="text-sm font-bold text-brand-violet mb-3">
          Please verify your email address to upload files.
        </h2>
        <button
          type="button"
          onClick={() => router.push("/verify-email")}
          className="bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold px-4 py-2 border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
        >
          Resend Verification Email
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto">
      <div className="w-full bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-brand-brown inline-block" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Encrypted File Ingestion
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-brand-peach text-brand-violet px-2 py-0.5 border border-brand-border">
            Libsodium
          </span>
        </div>

        <div
          className={`relative border-2 border-dashed p-4 w-full cursor-pointer transition-all flex-1 min-h-[150px] flex items-center justify-center
            ${
              state.isDragging
                ? "border-brand-peach-vibrant bg-brand-peach/15"
                : "border-brand-brown/60 bg-brand-cream-muted/50 hover:bg-brand-cream-muted hover:border-brand-brown"
            }
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
