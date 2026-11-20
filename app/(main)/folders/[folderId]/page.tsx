"use client";

import { useParams } from "next/navigation";

import FolderHeader from "@/components/folders/FolderHeader";
import FolderGrid from "@/components/folders/FolderGrid";
import FolderBreadcrumbs from "@/app/_components/folders/FolderBreadcrumbs";
import FileGrid from "@/app/_components/shared/FileGrid";

const SingleFolderPage = () => {
  const params = useParams();

  const folderId =
    typeof params.folderId === "string" ? params.folderId : null;

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-6 overflow-hidden p-4 sm:p-6 lg:p-8 text-brand-violet">
      <FolderBreadcrumbs folderId={folderId} />

      <FolderHeader title="Folder Workspace" parentId={folderId} />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 pb-2">
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
            Sub-Folders
          </h2>
          <FolderGrid parentId={folderId} />
        </div>

        <div className="pt-4 border-t-2 border-brand-border">
          <FileGrid folderId={folderId} />
        </div>
      </div>
    </div>
  );
};

export default SingleFolderPage;
