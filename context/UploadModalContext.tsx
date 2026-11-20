"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type UploadModalContextValue = {
  isOpen: boolean;
  folderId: string | null;
  openUpload: (folderId?: string | null) => void;
  closeUpload: () => void;
};

const UploadModalContext = createContext<UploadModalContextValue | null>(null);

export const UploadModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);

  const openUpload = useCallback((targetFolderId?: string | null) => {
    setFolderId(targetFolderId ?? null);
    setIsOpen(true);
  }, []);

  const closeUpload = useCallback(() => {
    setIsOpen(false);
    setFolderId(null);
  }, []);

  return (
    <UploadModalContext.Provider
      value={{ isOpen, folderId, openUpload, closeUpload }}
    >
      {children}
    </UploadModalContext.Provider>
  );
};

export const useUploadModal = () => {
  const context = useContext(UploadModalContext);

  if (!context) {
    throw new Error("useUploadModal must be used within UploadModalProvider");
  }

  return context;
};
