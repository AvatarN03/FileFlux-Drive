"use client";

import FolderActions from "@/components/folders/FolderActions";

interface FolderHeaderProps {
  title?: string;
  parentId?: string | null;
}

const FolderHeader = ({
  title = "Folder Workspaces",
  parentId,
}: FolderHeaderProps) => {
  return (
    <div className="flex shrink-0 flex-col items-start justify-between gap-4 border-2 border-brand-violet bg-brand-cream p-3 text-brand-violet shadow-brown-4 sm:flex-row sm:items-center md:p-5">
        <div className="space-y-1">          
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-brand-violet/75">
            Organize files into encrypted folders and sub-directories.
          </p>
        </div>

        <FolderActions parentId={parentId} showUpload={false} variant="header" />
      </div>
  );
};

export default FolderHeader;
