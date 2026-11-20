"use client";

import { UploadCloud } from "lucide-react";

import { useUploadModal } from "@/context/UploadModalContext";

type UploadButtonProps = {
  folderId?: string | null;
  label?: string;
  className?: string;
};

const UploadButton = ({
  folderId,
  label = "Upload Files",
  className = "",
}: UploadButtonProps) => {
  const { openUpload } = useUploadModal();

  return (
    <button
      type="button"
      onClick={() => openUpload(folderId)}
      className={`inline-flex items-center justify-center gap-1.5 cursor-pointer ${className}`}
    >
      <UploadCloud className="w-3.5 h-3.5" />
      {label}
    </button>
  );
};

export default UploadButton;
