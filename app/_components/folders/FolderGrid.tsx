"use client";

import { useFoldersAll } from "@/hooks/useFolderQueries";
import { Folder } from "lucide-react";
import { GetFoldersSkeleton } from "../shared/Skeleton";
import { Error } from "../Error";
import { IsEmpty } from "../IsEmpty";
import { FolderItem } from "./FolderItem";

interface FolderGridProps {
  parentId?: string | null;
}

const FolderGrid = ({ parentId = null }: FolderGridProps) => {
  const { data:folders =[] , isLoading, isError, isRefetching, refetch } = useFoldersAll(parentId);

  if (isLoading) return <GetFoldersSkeleton />;

  if (isError)return <Error isRefetching={isRefetching} handleRetry={refetch} text={"Failed to load folders."} />;


  if (folders.length === 0) {
    return <IsEmpty
      text="No folders found."
      link="Create a new folder"
      Icon={Folder}
      />
}

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
    </div>
  );
};

export default FolderGrid;