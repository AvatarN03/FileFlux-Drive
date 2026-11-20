"use client";

import { useMemo, useState } from "react";
import { Folder } from "lucide-react";

import { useFoldersAll } from "@/hooks/useFolderQueries";

import { useVault } from "@/context/VaultContext";

import { Error } from "@/components/folders/Error";
import { IsEmpty } from "@/components/folders/IsEmpty";
import { GetFoldersSkeleton } from "@/components/folders/Skeleton";
import FolderFilterToolbar from "@/components/folders/FolderFilterToolbar";
import { FolderItem } from "@/components/folders/FolderItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FolderGridProps {
  parentId?: string | null;
}

const FolderGrid = ({ parentId = null }: FolderGridProps) => {
  const [search, setSearch] = useState("");

  const [color, setColor] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const { isUnlocked } = useVault();

  const { data: folders = [], isLoading, isError, isRefetching, refetch } =
    useFoldersAll(parentId);

  const isFolderListLoading = isLoading || isRefetching;

  const effectiveSearch = isUnlocked ? search.trim().toLocaleLowerCase() : "";

  const filteredFolders = useMemo(
    () =>
      folders.filter((folder) => {
        const matchesSearch = effectiveSearch
          ? folder.name.toLocaleLowerCase().includes(effectiveSearch)
          : true;
        const matchesColor = color === "all" || folder.color === color;
        const matchesFavorite = !favoritesOnly || folder.isFavorite;

        return matchesSearch && matchesColor && matchesFavorite;
      }),
    [color, effectiveSearch, folders, favoritesOnly]
  );

  const clearFilters = () => {
    setSearch("");
    setColor("all");
    setFavoritesOnly(false);
  };

  if (isError) {
    return (
      <Error
        isRefetching={isRefetching}
        handleRetry={refetch}
        text="Failed to load folders."
      />
    );
  }

  return (
    <div className="space-y-4">
      <FolderFilterToolbar
        search={search}
        color={color}
        favoritesOnly={favoritesOnly}
        totalCount={folders.length}
        visibleCount={filteredFolders.length}
        isLoading={isFolderListLoading}
        searchDisabled={!isUnlocked}
        onSearchChange={setSearch}
        onColorChange={setColor}
        onFavoritesOnlyChange={setFavoritesOnly}
        onClear={clearFilters}
      />

      {isFolderListLoading ? (
        <GetFoldersSkeleton />
      ) : folders.length === 0 ? (
        <IsEmpty
          text="No folders found."
          links={[
            { label: "Visit folders page", href: "/folders" },
            { label: "Go to overview", href: "/dashboard" },
          ]}
          Icon={Folder}
        />
      ) : filteredFolders.length === 0 ? (
        <IsEmpty text="No folders match the current filters." Icon={Folder} />
      ) : (
        <div className="border-2 border-brand-border bg-brand-cream">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-brand-border bg-brand-cream-muted hover:bg-brand-cream-muted">
                <TableHead className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
                  Folder
                </TableHead>
                <TableHead className="w-0 px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {filteredFolders.map((folder) => (
              <FolderItem key={folder.id} folder={folder} />
            ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FolderGrid;
