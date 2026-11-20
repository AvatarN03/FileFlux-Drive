"use client";

import { useEffect } from "react";
import { UploadCloud, X } from "lucide-react";

import FileUpload from "@/app/_components/FileUpload";
import { useUploadModal } from "@/context/UploadModalContext";

const UploadModal = () => {
  const { isOpen, folderId, closeUpload } = useUploadModal();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeUpload();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeUpload, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-violet-dark/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeUpload();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        className="flex w-full max-w-xl max-h-[calc(100dvh-2rem)] flex-col overflow-hidden bg-brand-cream border-2 border-brand-violet shadow-brown-8 animate-fadeIn"
      >
        <div className="flex items-start justify-between gap-4 bg-brand-violet-dark text-brand-cream px-5 py-4 border-b-2 border-brand-violet">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 bg-brand-peach text-brand-violet border-2 border-brand-violet shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="upload-modal-title"
                className="text-sm font-extrabold uppercase tracking-wider"
              >
                Upload File
              </h2>
              <p className="mt-1 text-[11px] text-brand-cream/75 font-medium">
                Encrypt the file in your browser before it reaches storage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeUpload}
            aria-label="Close upload dialog"
            className="p-1.5 bg-brand-peach text-brand-violet border-2 border-brand-peach hover:bg-brand-peach-vibrant transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5">
          <FileUpload
            embedded
            folderId={folderId}
            onUploadComplete={closeUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
