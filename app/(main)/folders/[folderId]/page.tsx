"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import FolderHeader from "@/app/_components/folders/FolderHeader";
import FolderGrid from "@/app/_components/folders/FolderGrid";
import FileGrid from "@/app/_components/shared/FileGrid";

const SingleFolderPage = () => {
  const params = useParams();

  const folderId =
    typeof params.folderId === "string" ? params.folderId : null;

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-violet">
        <Link
          href="/folders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-[2px_2px_0px_0px_#BA5624] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-brown" />
          Back to Folders
        </Link>
        <span className="text-brand-violet/40">/</span>
        <span className="font-mono text-brand-brown text-[11px]">
          ID: {folderId}
        </span>
      </div>

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
