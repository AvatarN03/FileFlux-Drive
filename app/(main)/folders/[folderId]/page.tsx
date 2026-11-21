"use client";

import { useParams } from "next/navigation";

import FolderBreadcrumbs from "@/app/_components/folders/FolderBreadcrumbs";
import FolderContents from "@/app/_components/folders/FolderContents";
import FolderActions from "@/components/folders/FolderActions";

const SingleFolderPage = () => {
  const params = useParams();

  const folderId =
    typeof params.folderId === "string" ? params.folderId : null;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8 text-brand-violet">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FolderBreadcrumbs folderId={folderId} />
        <FolderActions parentId={folderId} folderLabel="Add Folder" />
      </div>

      <FolderContents folderId={folderId} />
    </div>
  );
};

export default SingleFolderPage;
