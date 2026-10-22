"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  FolderItem,
  FolderModalContextValue,
  FolderModalState,
  FolderModalMode,
} from "@/types/folder";

const FolderModalContext = createContext<FolderModalContextValue | null>(null);

export const FolderModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<FolderModalState>({
    mode: null,
    folder: null,
  });

  const openModal = (
    mode: Exclude<FolderModalMode, null>,
    folder: FolderItem
  ) => {
    setState({ mode, folder });
  };

  const closeModal = () => {
    setState({ mode: null, folder: null });
  };

  return (
    <FolderModalContext.Provider
      value={{ ...state, openModal, closeModal }}
    >
      {children}
    </FolderModalContext.Provider>
  );
};

export const useFolderModal = () => {
  const ctx = useContext(FolderModalContext);

  if (!ctx) {
    throw new Error(
      "useFolderModal must be used within FolderModalProvider"
    );
  }

  return ctx;
};