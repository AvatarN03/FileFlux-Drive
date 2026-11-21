"use client";

import { useState } from "react";

import { LayoutGrid, List } from "lucide-react";

import { useFiles } from "@/hooks/useFileQueries";
import { useFoldersAll } from "@/hooks/useFolderQueries";

import FolderFileItem from "@/app/_components/folders/FolderFileItem";
import { FolderItem } from "@/components/folders/FolderItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FolderContentsProps {
  folderId: string | null;
}

type ContentFilter = "all" | "folders" | "files";
type ContentView = "list" | "grid";

const FILTER_OPTIONS: Array<{ value: ContentFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "folders", label: "Folders" },
  { value: "files", label: "Files" },
];

const FolderContentsSkeleton = ({ viewMode }: { viewMode: ContentView }) => {
  if (viewMode === "grid") {
    return (
      <div className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-4 border-2 border-brand-border bg-brand-cream p-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse border-2 border-brand-border bg-brand-cream-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-2 border-brand-border bg-brand-cream">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-brand-border bg-brand-cream-muted hover:bg-brand-cream-muted">
            <TableHead className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
              Name
            </TableHead>
            <TableHead className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
              Size
            </TableHead>
            <TableHead className="w-0 px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4].map((item) => (
            <TableRow key={item} className="animate-pulse border-brand-border">
              <td className="px-3 py-4 sm:px-4">
                <div className="h-5 w-48 bg-brand-cream-muted" />
              </td>
              <td className="px-3 py-4 sm:px-4">
                <div className="h-4 w-16 bg-brand-cream-muted" />
              </td>
              <td className="px-3 py-4 sm:px-4">
                <div className="ml-auto h-8 w-20 bg-brand-cream-muted" />
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const FolderContents = ({ folderId }: FolderContentsProps) => {
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const [contentView, setContentView] = useState<ContentView>("list");
  const foldersQuery = useFoldersAll(folderId);
  const filesQuery = useFiles({ folderId });

  const folders = foldersQuery.data ?? [];
  const files = filesQuery.data ?? [];
  const visibleFolders = contentFilter === "files" ? [] : folders;
  const visibleFiles = contentFilter === "folders" ? [] : files;
  const isLoading = foldersQuery.isLoading || filesQuery.isLoading;
  const isError = foldersQuery.isError || filesQuery.isError;
  const itemCount = visibleFolders.length + visibleFiles.length;
  const totalItemCount = folders.length + files.length;
  const isGridView = contentView === "grid";
  const isRetrying = foldersQuery.isFetching || filesQuery.isFetching;

  const handleRetry = () => {
    void Promise.all([foldersQuery.refetch(), filesQuery.refetch()]);
  };

  if (isLoading) {
    return <FolderContentsSkeleton viewMode={contentView} />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        aria-live="polite"
        aria-busy={isRetrying}
        className="border-2 border-red-500 bg-red-100 p-4 text-xs font-bold text-red-800"
      >
        <p>Failed to load this folder&apos;s contents.</p>
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="mt-3 border-2 border-red-800 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 transition-colors hover:bg-red-200 disabled:cursor-wait disabled:opacity-60"
        >
          {isRetrying ? "Retrying…" : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="folder-contents-heading" className="space-y-3">
      <div className="flex flex-col gap-3 border-b-2 border-brand-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="folder-contents-heading"
          className="text-xs font-bold uppercase tracking-wider text-brand-violet"
        >
          Folder Contents ({itemCount})
        </h2>

        <div className="flex flex-wrap gap-2">
          <div
            role="group"
            aria-label="Filter folder contents"
            className="flex flex-wrap gap-2"
          >
            {FILTER_OPTIONS.map((option) => {
              const count =
                option.value === "all"
                  ? totalItemCount
                  : option.value === "folders"
                    ? folders.length
                    : files.length;
              const isActive = contentFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setContentFilter(option.value)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 border-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border-brand-brown bg-brand-brown text-brand-cream"
                      : "border-brand-border bg-brand-cream-muted text-brand-violet hover:bg-brand-peach"
                  }`}
                >
                  {option.label}
                  <span className={isActive ? "text-brand-peach" : "text-brand-violet/60"}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Change content view"
            className="flex gap-2"
          >
            <button
              type="button"
              aria-label="List view"
              aria-pressed={contentView === "list"}
              onClick={() => setContentView("list")}
              className={`inline-flex cursor-pointer items-center justify-center border-2 p-1.5 transition-colors ${
                contentView === "list"
                  ? "border-brand-brown bg-brand-brown text-brand-cream"
                  : "border-brand-border bg-brand-cream-muted text-brand-violet hover:bg-brand-peach"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={contentView === "grid"}
              onClick={() => setContentView("grid")}
              className={`inline-flex cursor-pointer items-center justify-center border-2 p-1.5 transition-colors ${
                contentView === "grid"
                  ? "border-brand-brown bg-brand-brown text-brand-cream"
                  : "border-brand-border bg-brand-cream-muted text-brand-violet hover:bg-brand-peach"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {itemCount === 0 ? (
        <div className="border-2 border-dashed border-brand-border bg-brand-cream p-10 text-center shadow-brown-4">
          <h2 className="text-sm font-extrabold text-brand-violet">
            {contentFilter === "all"
              ? "This folder is empty"
              : `No ${contentFilter} in this folder`}
          </h2>
          <p className="mt-1 text-xs text-brand-violet/70">
            {contentFilter === "all"
              ? "Add a folder or upload an encrypted file to get started."
              : "Switch the filter to All to see the other content in this folder."}
          </p>
        </div>
      ) : (
        <div
          className={`border-2 border-brand-border bg-brand-cream ${
            isGridView ? "p-4" : "overflow-x-auto"
          }`}
        >
          <Table className={isGridView ? "block min-w-0" : undefined}>
            {!isGridView && (
              <TableHeader>
                <TableRow className="border-b-2 border-brand-border bg-brand-cream-muted hover:bg-brand-cream-muted">
                  <TableHead className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
                    Name
                  </TableHead>
                  <TableHead className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
                    Size
                  </TableHead>
                  <TableHead className="w-0 px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-brand-violet sm:px-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody
              className={
                isGridView
                  ? "grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-4"
                  : undefined
              }
            >
              {visibleFolders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  showSize
                  viewMode={contentView}
                />
              ))}
              {visibleFiles.map((file) => (
                <FolderFileItem key={file.id} file={file} viewMode={contentView} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default FolderContents;
