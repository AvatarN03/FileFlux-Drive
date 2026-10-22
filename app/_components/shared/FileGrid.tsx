"use client";

import { FileText } from "lucide-react";
import { useFolderFiles } from "@/hooks/useFileQueries";

interface FileGridProps {
  folderId: string | null;
}

const FileGrid = ({ folderId }: FileGridProps) => {
  const { data, isLoading, isError } = useFolderFiles(folderId);

  if (isLoading) {
    return (
      <div className="mt-8">
        Loading files...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 text-red-500">
        Failed to load files.
      </div>
    );
  }

  const files = data?.files ?? [];

  if (!files.length) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-brown/40 p-10 text-center">
        <FileText className="mx-auto h-12 w-12 text-brown/70" />

        <h3 className="mt-4 text-lg font-semibold text-violet">
          No files
        </h3>

        <p className="mt-2 text-ember/70">
          Upload files into this folder.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map((file: any) => (
        <div
          key={file.id}
          className="rounded-xl border border-brown/20 bg-peach p-5 hover:shadow-lg transition"
        >
          <FileText className="h-10 w-10 text-violet" />

          <h3 className="mt-4 font-semibold text-ember truncate">
            {file.originalName}
          </h3>

          <p className="mt-2 text-sm text-ember/70">
            {(file.size / 1024).toFixed(2)} KB
          </p>

          <p className="text-xs text-ember/60 mt-1 uppercase">
            {file.extension}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;