"use client";

import FolderGrid from "@/app/_components/folders/FolderGrid";
import FolderHeader from "@/app/_components/folders/FolderHeader";

const FolderPage = () => {
  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      <FolderHeader title="Root Workspaces & Folders" />
      <FolderGrid />
    </div>
  );
};

export default FolderPage;
