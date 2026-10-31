"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Folder, FileText, Download, Eye, Trash2, ArrowRight } from "lucide-react";
import { formatFileSize } from "@/lib/file";

const FavoritesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockFavorites = [
    {
      id: "fav-1",
      name: "Quarterly-Board-Deck",
      extension: "pdf",
      size: 6400000,
      type: "file",
      starredAt: "2 days ago",
    },
    {
      id: "fav-2",
      name: "Brand Identity & Guidelines 2026",
      extension: "folder",
      itemsCount: 14,
      type: "folder",
      starredAt: "1 week ago",
    },
    {
      id: "fav-3",
      name: "Master-Client-Database",
      extension: "xlsx",
      size: 1250000,
      type: "file",
      starredAt: "3 weeks ago",
    },
    {
      id: "fav-4",
      name: "Legal-Contracts-Archive",
      extension: "folder",
      itemsCount: 8,
      type: "folder",
      starredAt: "1 month ago",
    },
  ];

  const filtered = mockFavorites.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Static Preview Mode
        </div>
      </div>

      {/* Grid of Favorite Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-brand-cream border-2 border-brand-border hover:border-brand-brown shadow-[3px_3px_0px_0px_#BA5624] p-4 flex flex-col justify-between transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-peach border border-brand-violet/30 flex items-center justify-center shrink-0">
                {item.type === "folder" ? (
                  <Folder className="w-5 h-5 text-brand-brown fill-brand-brown/20" />
                ) : (
                  <FileText className="w-5 h-5 text-brand-brown" />
                )}
              </div>
              <button
                type="button"
                title="Remove from favorites"
                className="p-1 hover:bg-brand-cream-muted text-brand-peach-vibrant transition-colors cursor-pointer"
              >
                <Star size={16} className="fill-brand-peach-vibrant text-brand-peach-vibrant" />
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-brand-violet truncate mb-1">
                {item.name}
              </h3>
              <p className="text-[11px] font-mono text-brand-violet/70">
                {item.type === "folder"
                  ? `${item.itemsCount} items inside`
                  : `${formatFileSize(item.size || 0)} · ${item.extension.toUpperCase()}`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold">
              <span className="text-[10px] text-brand-violet/60 font-mono">
                Starred {item.starredAt}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-brand-brown hover:text-brand-brown-dark transition-colors cursor-pointer"
              >
                Open {item.type === "folder" ? "Folder" : "File"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;

