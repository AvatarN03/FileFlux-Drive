import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { ItemNameDisplayProps } from "@/types/file";



const ItemNameDisplay = ({
  name,
  icon,
  isEditing,
  editName,
  path,
  onEditChange,
  onBlur,
  onKeyDown,
}: ItemNameDisplayProps) => {
  if (isEditing) {
    return (
      <input
        type="text"
        value={editName}
        autoFocus
        onChange={(e) => onEditChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full px-2 py-1 rounded border border-violet bg-peach text-violet focus:outline-none focus:ring-2 focus:ring-violet"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 group-hover:text-violet">
        {icon}
        <span className="truncate" title={name}>
          {name}
        </span>
      </div>

      {path && path.length > 0 && (
        <div className="flex items-center gap-1 mt-1 text-sm text-yellow-300 group-hover:text-violet ml-10">
          {path.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1">
              <Link href={`/folders/${item.id}`} className="hover:text-ember">
                {item.name}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemNameDisplay;