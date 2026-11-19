"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import type { FileItem } from "@/types/file";

type ModalMode = "preview" | "details" | "edit" | "move" | null;

type FileModalState = {
  mode: ModalMode;
  file: FileItem | null;
};

type FileModalContextValue = FileModalState & {
  openModal: (mode: Exclude<ModalMode, null>, file: FileItem) => void;
  closeModal: () => void;
};

const FileModalContext = createContext<FileModalContextValue | null>(null);

export const FileModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FileModalState>({ mode: null, file: null });

  const openModal = (mode: Exclude<ModalMode, null>, file: FileItem) => {
    setState({ mode, file });
  };

  const closeModal = () => setState({ mode: null, file: null });

  return (
    <FileModalContext.Provider value={{ ...state, openModal, closeModal }}>
      {children}
    </FileModalContext.Provider>
  );
};

export const useFileModal = () => {
  const ctx = useContext(FileModalContext);
  if (!ctx) throw new Error("useFileModal must be used within FileModalProvider");
  return ctx;
};
