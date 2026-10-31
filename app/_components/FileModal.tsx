"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface FileModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const FileModal = ({
  title,
  onClose,
  children,
  maxWidth = "max-w-lg",
}: FileModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-violet-dark/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-brand-cream border-2 border-brand-violet shadow-[8px_8px_0px_0px_#BA5624] overflow-hidden animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 bg-brand-cream-muted border-b-2 border-brand-border">
          <h2 className="font-extrabold text-sm text-brand-violet truncate tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 border border-brand-border hover:bg-brand-peach text-brand-violet transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default FileModal;
