import Link from "next/link";
import { Folder } from "lucide-react";
import { GetAllFolders } from "@/types/folder";

type FolderItemProps = {
  folder: GetAllFolders[number];
};

export function FolderItem({ folder }: FolderItemProps) {
  return (
    <div className="bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-[2px_2px_0px_0px_#BA5624] p-3 transition-all flex items-center justify-between">
      <Link
        href={`/folders/${folder.id}`}
        className="flex flex-1 items-center gap-3 overflow-hidden"
      >
        <div className="w-9 h-9 bg-brand-peach border border-brand-violet/40 flex items-center justify-center shrink-0">
          <Folder className="h-5 w-5 text-brand-brown fill-brand-brown/20" />
        </div>

        <div className="truncate">
          <h3 className="truncate font-bold text-xs text-brand-violet hover:text-brand-brown transition-colors">
            {folder.name}
          </h3>
          <span className="text-[10px] font-mono text-brand-violet/60">
            Workspace folder
          </span>
        </div>
      </Link>
    </div>
  );
}
