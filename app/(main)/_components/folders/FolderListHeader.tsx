import Link from "next/link";

import { Plus } from "lucide-react";

import { FolderListHeaderProps } from "@/types/file";



const FolderListHeader = ({ onAddClick }: FolderListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-center items-center gap-4 md:gap-8">
        <h1 className="text-base md:text-xl text-brown">Folders</h1>

        <div
          className="flex justify-center items-center md:gap-1 bg-brown hover:bg-peach cursor-pointer p-1 md:p-2 rounded-xl"
          onClick={onAddClick}
        >
          <Plus className="text-violet w-4 h-4 md:w-5 md:h-5" />
          <h1 className="text-violet text-sm md:text-base">Add Folder</h1>
        </div>
      </div>
      <Link href={"/folders"} className="hover:underline text-sm md:text-base">
        View all
      </Link>
    </div>
  );
};

export default FolderListHeader;