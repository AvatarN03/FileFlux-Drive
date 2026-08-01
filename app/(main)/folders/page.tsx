"use client";

import FolderGrid from "@/app/_components/folders/FolderGrid";
import FolderHeader from "@/app/_components/folders/FolderHeader";

const FolderPage = () => {
  return (
    <section className="p-8 text-slate-200">
      <FolderHeader />

      {/* Folder Grid/List */}
      <FolderGrid />
    </section>
  );
};

export default FolderPage;