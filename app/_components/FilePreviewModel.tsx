"use client";

import Image from "next/image";
import { getFileCategoryFilter } from "@/lib/file/operations";
import FileModal from "./FileModal";
import { File as FileIcon } from "lucide-react";

const FilePreviewModal = ({ file, onClose }: { file: any; onClose: () => void }) => {
  const category = getFileCategoryFilter(file);

  return (
    <FileModal title={`${file.name}.${file.extension}`} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-center justify-center bg-brown/5 rounded-lg min-h-64">
        {category === "image" ? (
          <div className="relative w-full max-h-[70vh] aspect-video">
            <Image
              src={file.thumbnailUrl ?? file.url}
              alt={file.name}
              fill
              className="object-contain"
            />
          </div>
        ) : category === "video" ? (
          <video src={file.url} controls className="w-full max-h-[70vh] rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-violet/60">
            <FileIcon size={56} />
            <p className="text-sm">Preview not available for this file type.</p>
          </div>
        )}
      </div>
    </FileModal>
  );
};

export default FilePreviewModal;