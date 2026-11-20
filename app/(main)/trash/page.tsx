"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Folder,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { useTrashFiles } from "@/hooks/useFileQueries";
import { useFileMutations } from "@/hooks/useFileMutations";
import { useFolderRestore } from "@/hooks/useFolderMutations";
import { useTrashFolders } from "@/hooks/useFolderQueries";
import { formatFileSize } from "@/lib/file";
import toastC from "@/lib/toast";

const TrashPage = () => {
  const {
    data: trashFiles = [],
    isLoading: filesLoading,
    isError: filesError,
  } = useTrashFiles();
  const {
    data: trashFolders = [],
    isLoading: foldersLoading,
    isError: foldersError,
  } = useTrashFolders();
  const { restore } = useFileMutations();
  const restoreFolder = useFolderRestore();

  const isLoading = filesLoading || foldersLoading;
  const isError = filesError || foldersError;
  const trashItemCount = trashFiles.length + trashFolders.length;

  const handleRestore = async (fileId: string, name: string) => {
    try {
      await restore.mutateAsync({ fileId });
      toastC({ data: `"${name}" restored to your files.`, type: "success" });
    } catch {
      toastC({ data: "Failed to restore file.", type: "error" });
    }
  };

  const handleRestoreFolder = async (folderId: string, name: string) => {
    try {
      await restoreFolder.mutateAsync(folderId);
      toastC({ data: `"${name}" restored to your folders.`, type: "success" });
    } catch {
      toastC({ data: "Failed to restore folder.", type: "error" });
    }
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-brown-4 p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Trash2 className="w-3 h-3 text-brand-brown" />
            Soft-deleted files and folders
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Trash Console
          </h1>
          <p className="text-xs text-brand-violet/75">
            Restore files before your configured retention cleanup removes them.
          </p>
        </div>
        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider">
          {trashItemCount} item{trashItemCount === 1 ? "" : "s"}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 bg-brand-cream-muted border-2 border-brand-border text-xs">
        <AlertTriangle className="w-4 h-4 text-brand-brown shrink-0" />
        <p className="font-semibold text-brand-violet/85">
          Deleted encrypted files continue to count toward your quota until a
          retention cleanup process permanently removes them. Folder trees can
          be restored from this page.
        </p>
      </div>

      <div className="bg-brand-cream border-2 border-brand-violet shadow-brown-4 overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-xs font-mono text-brand-violet/60">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading trash...
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-xs font-bold text-red-700">
            Failed to load trash. Please try again.
          </div>
        ) : trashItemCount === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-violet-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-sm font-bold text-brand-violet">Trash is clean</h3>
            <p className="text-xs text-brand-violet/60 mt-1 max-w-sm">
              No files or folders are marked for deletion in your vault.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 px-4 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-violet shadow-violet-2 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-cream-muted text-[10px] font-bold uppercase tracking-wider border-b-2 border-brand-border text-brand-violet">
                  <th className="py-3 px-4">Deleted Item</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Deleted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {trashFolders.map((folder) => (
                  <tr key={`folder-${folder.id}`} className="hover:bg-brand-cream-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-brand-brown shrink-0" />
                        <span className="font-bold text-brand-violet">{folder.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-brand-violet/80">
                      Folder tree
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-brand-violet/70">
                      {new Date(folder.deletedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={restore.isPending || restoreFolder.isPending}
                        onClick={() => handleRestoreFolder(folder.id, folder.name)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-cream-muted border border-brand-border hover:bg-brand-peach text-brand-violet font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-brand-brown" />
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
                {trashFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-brand-cream-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-brown shrink-0" />
                        <span className="font-bold text-brand-violet">
                          {file.name}{file.extension ? `.${file.extension}` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-brand-violet/80">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-brand-violet/70">
                      {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={restore.isPending || restoreFolder.isPending}
                        onClick={() => handleRestore(file.id, file.name)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-cream-muted border border-brand-border hover:bg-brand-peach text-brand-violet font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-brand-brown" />
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashPage;
