"use client";

import { Search, Star, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

import { FOLDER_COLOR_OPTIONS } from "@/types/folder";

type FolderFilterToolbarProps = {
  search: string;
  color: string;
  favoritesOnly: boolean;
  totalCount: number;
  visibleCount: number;
  isLoading?: boolean;
  searchDisabled?: boolean;
  onSearchChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onFavoritesOnlyChange: (value: boolean) => void;
  onClear: () => void;
};

const FolderFilterToolbar = ({
  search,
  color,
  favoritesOnly,
  totalCount,
  visibleCount,
  isLoading = false,
  searchDisabled = false,
  onSearchChange,
  onColorChange,
  onFavoritesOnlyChange,
  onClear,
}: FolderFilterToolbarProps) => {
  const selectedColor =
    color === "all"
      ? null
      : FOLDER_COLOR_OPTIONS.find((option) => option.value === color);
  const hasActiveFilters = Boolean(search) || color !== "all" || favoritesOnly;

  return (
    <div className="space-y-3 text-brand-violet">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="order-1 flex items-end justify-end gap-2 sm:order-1 sm:justify-start">
          <div className="flex w-36 flex-col gap-1.5 sm:w-48">
            <span className="sr-only text-xs font-bold uppercase tracking-wider sm:not-sr-only">
              Color
            </span>
            <Select
              value={color}
              onValueChange={(nextColor) => {
                if (nextColor) onColorChange(nextColor);
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-none border-2 border-brand-border bg-brand-cream-muted px-3 text-xs font-bold text-brand-violet shadow-none focus:border-brand-brown focus:ring-0">
                <span className="flex min-w-0 items-center gap-2">
                  {selectedColor && (
                    <span
                      className="h-3.5 w-3.5 shrink-0 border border-brand-violet"
                      style={{ backgroundColor: selectedColor.value }}
                    />
                  )}
                  <span className="truncate">{selectedColor?.label ?? "All colors"}</span>
                </span>
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-brand-violet bg-brand-cream text-brand-violet">
                <SelectItem
                  value="all"
                  className="rounded-none py-2 text-xs font-bold focus:bg-brand-peach focus:text-brand-violet"
                >
                  All colors
                </SelectItem>
                {FOLDER_COLOR_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-none py-2 text-xs font-bold focus:bg-brand-peach focus:text-brand-violet"
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 border border-brand-violet"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="sr-only text-xs font-bold uppercase tracking-wider sm:not-sr-only">
              Favorite
            </span>
            <Toggle
              type="button"
              pressed={favoritesOnly}
              onPressedChange={onFavoritesOnlyChange}
              variant="outline"
              aria-label="Show favorite folders only"
              className="h-10 w-10 rounded-none border-2 border-brand-border bg-brand-cream-muted px-0 text-brand-violet shadow-none hover:bg-brand-peach hover:text-brand-violet sm:w-44 sm:justify-start sm:gap-2 sm:px-3 sm:text-xs sm:font-bold data-[state=on]:border-brand-brown data-[state=on]:bg-brand-peach data-[state=on]:text-brand-brown"
            >
              <Star className="h-4 w-4" fill={favoritesOnly ? "currentColor" : "none"} />
              <span className="hidden sm:inline">Favorites only</span>
            </Toggle>
          </div>
        </div>

        <div className="hidden w-full min-w-0 flex-1 flex-col gap-1.5 sm:order-2 sm:flex sm:max-w-sm">
          <label
            htmlFor="folder-search"
            className="text-xs font-bold uppercase tracking-wider"
          >
            Search folders
          </label>
          <div className="relative flex items-center border-2 border-brand-border bg-brand-cream-muted transition focus-within:border-brand-brown">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-brand-brown" />
            <input
              id="folder-search"
              type="search"
              value={search}
              disabled={searchDisabled}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={
                searchDisabled
                  ? "Unlock vault to search folder names"
                  : "Search by folder name..."
              }
              className="h-10 w-full bg-transparent px-9 text-xs font-semibold text-brand-violet outline-none placeholder:text-brand-violet/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {search && !searchDisabled && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 text-brand-violet/60 transition-colors hover:text-brand-violet"
                aria-label="Clear folder search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:hidden">
        <label htmlFor="folder-search-mobile" className="text-xs font-bold uppercase tracking-wider">
          Search folders
        </label>
        <div className="relative flex items-center border-2 border-brand-border bg-brand-cream-muted transition focus-within:border-brand-brown">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-brand-brown" />
          <input
            id="folder-search-mobile"
            type="search"
            value={search}
            disabled={searchDisabled}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={
              searchDisabled
                ? "Unlock vault to search folder names"
                : "Search by folder name..."
            }
            className="h-10 w-full bg-transparent px-9 text-xs font-semibold text-brand-violet outline-none placeholder:text-brand-violet/40 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {search && !searchDisabled && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 text-brand-violet/60 transition-colors hover:text-brand-violet"
              aria-label="Clear folder search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-brand-violet/65">
        <span>
          {isLoading
            ? "Loading folders..."
            : `Showing ${visibleCount} of ${totalCount} folder${totalCount === 1 ? "" : "s"}`}
        </span>
        <div className="flex items-center gap-3">
          {!isLoading && searchDisabled && <span>Unlock vault to search names.</span>}
          {!isLoading && hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="font-bold text-brand-brown underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderFilterToolbar;
