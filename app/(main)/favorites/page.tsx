"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star, Folder, FileText, ArrowRight, Search, Inbox } from "lucide-react";
import { useFiles } from "@/hooks/useFileQueries";
import { useFoldersAll } from "@/hooks/useFolderQueries";
import { formatFileSize } from "@/lib/file";

const FavoritesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rawFiles = [], isLoading: filesLoading } = useFiles({
    folderId: null,
  });
  const { data: rawFolders = [], isLoading: foldersLoading } = useFoldersAll(null);

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

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return favoriteItems;
    const q = searchTerm.toLowerCase();
    return favoriteItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [favoriteItems, searchTerm]);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Star className="w-3 h-3 text-brand-peach-vibrant fill-brand-peach-vibrant" />
            Bookmarked & Starred Items
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Favorites
          </h1>
          <p className="text-xs text-brand-violet/75">
            Your pinned folders and critical files for single-click access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter favorites..."
              className="px-3 py-1.5 pl-8 text-xs bg-brand-cream border-2 border-brand-violet text-brand-violet placeholder:text-brand-violet/50 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-brand-violet/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-brand-violet/60">
          Loading starred items from vault...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-8">
          <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#381D2A]">
            <Star className="w-6 h-6 text-brand-peach-vibrant fill-brand-peach-vibrant" />
          </div>
          <h3 className="text-sm font-bold text-brand-violet">No favorite items yet</h3>
          <p className="text-xs text-brand-violet/60 mt-1 max-w-sm">
            Star important files or folders across your workspace to access them quickly here.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 px-4 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-[3px_3px_0px_0px_#BA5624] p-4 flex flex-col justify-between transition-all group"
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
    </div>
  );
};

export default FavoritesPage;
