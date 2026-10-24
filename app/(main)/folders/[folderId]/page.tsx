"use client";

import { useParams } from "next/navigation";

import FolderHeader from "@/app/_components/folders/FolderHeader";
import FolderGrid from "@/app/_components/folders/FolderGrid";
import FileGrid from "@/app/_components/shared/FileGrid";

const FolderPage = () => {
  const params = useParams();

  const folderId =
    typeof params.folderId === "string"
      ? params.folderId
      : null;

  return (
    <div className="flex flex-col gap-8 mb-10">
      <FolderHeader parentId={folderId} />

      <FolderGrid parentId={folderId} />

      <FileGrid folderId={folderId} />
    </div>
  );
};

export default FolderPage;