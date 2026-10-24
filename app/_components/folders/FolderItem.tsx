// FolderItem.tsx

import Link from "next/link";
import { Folder, MoreVertical } from "lucide-react";
import { GetAllFolders } from "@/types/folder";

type FolderItemProps = {
  folder: GetAllFolders[number];
};


export function FolderItem( {folder} : FolderItemProps) {
  return (
    <div className="rounded-xl border border-brown/30 bg-slate-700 hover:bg-slate-800 p-2">
      <div className="flex items-center justify-between">
        <Link
          href={`/folders/${folder.id}`}
          className="flex flex-1 items-center gap-4"
        >
          <Folder className="h-8 w-8 text-ember" />

          <div>
            <h3 className="truncate font-semibold text-sm">
              {folder.name}
            </h3>
          </div>
        </Link>

        <button className="rounded-md p-2 hover:bg-black/50 cursor-pointer">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}