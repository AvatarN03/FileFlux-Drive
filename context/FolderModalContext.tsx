"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FolderItem = {
  id: string;
  name: string;
  isFavorite: boolean;
};

type FolderModalMode = "details" | "edit" | "move" | "delete" | null;

type FolderModalState = {
  mode: FolderModalMode;
  folder: FolderItem | null;
};

type FolderModalContextValue = FolderModalState & {
  openModal: (
    mode: Exclude<FolderModalMode, null>,
    folder: FolderItem
  ) => void;
  closeModal: () => void;
};

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
