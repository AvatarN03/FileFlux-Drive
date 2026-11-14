"use client";

import { useParams } from "next/navigation";

import FolderHeader from "@/app/_components/folders/FolderHeader";
import FolderGrid from "@/app/_components/folders/FolderGrid";
import FolderBreadcrumbs from "@/app/_components/folders/FolderBreadcrumbs";
import FileGrid from "@/app/_components/shared/FileGrid";

const SingleFolderPage = () => {
  const params = useParams();

  const folderId =
    typeof params.folderId === "string" ? params.folderId : null;

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      <FolderBreadcrumbs folderId={folderId} />

      <FolderHeader title="Folder Workspace" parentId={folderId} />

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
  );
};

export default SingleFolderPage;
