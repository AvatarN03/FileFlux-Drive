"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useFolderPath } from "@/hooks/useFolderPath";

export default function FolderBreadcrumbs({ folderId }: { folderId: string | null }) {
  const { data: path, isLoading, isError } = useFolderPath(folderId);

  return (
    <nav aria-label="Folder breadcrumb" className="flex min-w-0 items-center gap-2 text-xs font-bold text-brand-violet">
      <Link
        href="/folders"
        className="shrink-0 border-2 border-brand-border bg-brand-cream px-3 py-1.5 shadow-[2px_2px_0px_0px_#BA5624] transition-colors hover:border-brand-brown"
      >
        Folders
      </Link>
      {isLoading && <span className="text-brand-violet/60">Loading path…</span>}
      {isError && <span role="alert" className="text-red-700">Path unavailable</span>}
      {!isLoading && !isError && path?.map((folder, index) => {
        const isCurrent = index === path.length - 1;
        return (
          <span key={folder.id} className="flex min-w-0 items-center gap-2">
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-brand-violet/45" />
            {isCurrent ? (
              <span aria-current="page" className="truncate text-brand-brown">{folder.name}</span>
            ) : (
              <Link
                href={`/folders/${folder.id}`}
                className="max-w-40 truncate hover:underline"
              >
                {folder.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
