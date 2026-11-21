"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArrowRight, FileText, Folder, Search, Star, X } from "lucide-react";

import { useFiles } from "@/hooks/useFileQueries";
import { useFoldersAll } from "@/hooks/useFolderQueries";

import { useVault } from "@/context/VaultContext";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { formatFileSize } from "@/lib/file";

const typeFilterOptions = [
  { value: "all", label: "All files & folders" },
  { value: "files", label: "Only files" },
  { value: "folders", label: "Only folders" },
];

const FavoritesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "files" | "folders">(
    "all",
  );

  const { data: rawFiles = [], isLoading: filesLoading } = useFiles({
    folderId: null,
  });
  const { data: rawFolders = [], isLoading: foldersLoading } = useFoldersAll(null);

  const { isUnlocked } = useVault();

  const isLoading = filesLoading || foldersLoading;

  const favoriteItems = useMemo(() => {
    const fileFavs = (rawFiles || [])
      .filter((f) => f.isFavorite)
      .map((f) => ({
        id: f.id,
        name: f.name,
        extension: f.extension || "",
        size: f.size || 0,
        type: "file" as const,
        url: "/dashboard",
        updatedAt: f.createdAt,
      }));

    const folderFavs = (rawFolders || [])
      .filter((f) => f.isFavorite)
      .map((f) => ({
        id: f.id,
        name: f.name,
        extension: "folder",
        size: 0,
        type: "folder" as const,
        url: `/folders/${f.id}`,
        updatedAt: undefined,
      }));

    return [...folderFavs, ...fileFavs];
  }, [rawFiles, rawFolders]);

  const effectiveSearch = isUnlocked ? searchTerm.trim() : "";

  const filtered = useMemo(() => {
    const bySearch = effectiveSearch
      ? favoriteItems.filter((item) =>
          item.name.toLowerCase().includes(effectiveSearch.toLowerCase()),
        )
      : favoriteItems;
    if (filterType === "files") {
      return bySearch.filter((item) => item.type === "file");
    }
    if (filterType === "folders") {
      return bySearch.filter((item) => item.type === "folder");
    }
    return bySearch;
  }, [effectiveSearch, favoriteItems, filterType]);

  const hasActiveFilters = Boolean(effectiveSearch) || filterType !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Favorites
          </h1>
          <p className="text-xs text-brand-violet/75">
            Your pinned folders and critical files for single-click access.
          </p>
        </div>

        {!isLoading && (
          <div className="inline-flex shrink-0 items-center gap-2 self-start border-2 border-brand-violet bg-brand-peach px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-violet-2 sm:self-auto">
            <Star className="h-3.5 w-3.5 fill-brand-brown text-brand-brown" />
            {favoriteItems.length} starred
          </div>
        )}
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-brand-violet/60">
          Loading starred items from vault...
        </div>
      ) : favoriteItems.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-8">
          <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-violet-2">
            <Star className="w-6 h-6 text-brand-peach-vibrant fill-brand-peach-vibrant" />
          </div>
          <h3 className="text-sm font-bold text-brand-violet">No favorite items yet</h3>
          <p className="text-xs text-brand-violet/60 mt-1 max-w-sm">
            Star important files or folders across your workspace to access them quickly here.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 px-4 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-violet-2 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <>
          {/* Search + type filter bar */}
          <div className="space-y-3">
            <div className="flex flex-col gap-3 border-2 border-brand-border bg-brand-cream-muted p-3 sm:flex-row sm:items-center">
              <div className="relative flex min-w-0 flex-1 items-center border-2 border-brand-border bg-brand-cream transition focus-within:border-brand-brown">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-brand-brown" />
                <input
                  type="search"
                  value={effectiveSearch}
                  disabled={!isUnlocked}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isUnlocked
                      ? "Filter favorites..."
                      : "Unlock vault to search favorites"
                  }
                  aria-label="Filter favorites"
                  className="h-10 w-full bg-transparent px-9 text-xs font-semibold text-brand-violet outline-none placeholder:text-brand-violet/40 disabled:cursor-not-allowed disabled:opacity-60"
                />
                {effectiveSearch && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear favorites search"
                    className="absolute right-2.5 text-brand-violet/60 transition-colors hover:text-brand-violet"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Select
                value={filterType}
                onValueChange={(next) => {
                  if (next === "all" || next === "files" || next === "folders") {
                    setFilterType(next);
                  }
                }}
              >
                <SelectTrigger
                  aria-label="Filter favorites by type"
                  className="h-10 w-full shrink-0 rounded-none border-2 border-brand-border bg-brand-cream px-3 text-xs font-bold text-brand-violet shadow-none focus:border-brand-brown focus:ring-0 sm:w-48"
                >
                  <span className="truncate">
                    {typeFilterOptions.find((option) => option.value === filterType)
                      ?.label ?? "All files & folders"}
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-brand-violet bg-brand-cream text-brand-violet">
                  {typeFilterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-none py-2 text-xs font-bold focus:bg-brand-peach focus:text-brand-violet"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-brand-violet/65">
              <span>
                Showing {filtered.length} of {favoriteItems.length} favorite
                {favoriteItems.length === 1 ? "" : "s"}
              </span>
              <div className="flex items-center gap-3">
                {!isUnlocked && <span>Unlock vault to search names.</span>}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-bold text-brand-brown underline-offset-2 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-8">
              <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-violet-2">
                <Search className="w-6 h-6 text-brand-brown" />
              </div>
              <h3 className="text-sm font-bold text-brand-violet">
                No favorites match your filters
              </h3>
              <p className="text-xs text-brand-violet/60 mt-1 max-w-sm">
                Try a different name or switch the type filter to see your starred items.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-violet-2 transition-all"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-brown-3 p-4 flex flex-col justify-between transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-peach border border-brand-violet/30 flex items-center justify-center shrink-0">
                      {item.type === "folder" ? (
                        <Folder className="w-5 h-5 text-brand-brown fill-brand-brown/20" />
                      ) : (
                        <FileText className="w-5 h-5 text-brand-brown" />
                      )}
                    </div>
                    <div className="p-1 text-brand-peach-vibrant">
                      <Star size={16} className="fill-brand-peach-vibrant text-brand-peach-vibrant" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-brand-violet truncate mb-1 group-hover:text-brand-brown transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-mono text-brand-violet/70">
                      {item.type === "folder"
                        ? "Folder"
                        : `${formatFileSize(item.size || 0)} · ${item.extension.toUpperCase()}`}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold">
                    <span className="text-[10px] text-brand-violet/60 font-mono">
                      {item.type === "folder" ? "Pinned Folder" : "Starred File"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-brown group-hover:translate-x-0.5 transition-transform">
                      Open {item.type === "folder" ? "Folder" : "File"} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
