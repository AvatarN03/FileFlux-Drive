"use client";

import { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { formatFileSize } from "@/lib/file";
import toastC from "@/lib/toast";

const TrashPage = () => {
  const [trashItems, setTrashItems] = useState([
    {
      id: "tr-1",
      name: "Old-Design-Tokens-v1",
      extension: "json",
      size: 45000,
      deletedAt: "3 days ago",
      expiresIn: "27 days",
    },
    {
      id: "tr-2",
      name: "Unused-Raw-Footage",
      extension: "mov",
      size: 34500000,
      deletedAt: "10 days ago",
      expiresIn: "20 days",
    },
    {
      id: "tr-3",
      name: "Outdated-Candidate-List",
      extension: "csv",
      size: 210000,
      deletedAt: "18 days ago",
      expiresIn: "12 days",
    },
  ]);

  const handleRestore = (name: string, id: string) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== id));
    toastC({ data: `"${name}" restored to root repository!`, type: "success" });
  };

  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return;
    setTrashItems([]);
    toastC({ data: "Trash purged permanently.", type: "success" });
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Trash2 className="w-3 h-3 text-brand-brown" />
            30-Day Auto Retention Policy
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Trash & Soft Delete Console
          </h1>
          <p className="text-xs text-brand-violet/75">
            Items in the trash will be permanently deleted after 30 days. You can restore them anytime before.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider">
            Static Preview Mode
          </div>
          {trashItems.length > 0 && (
            <button
              type="button"
              onClick={handleEmptyTrash}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-brand-cream text-xs font-bold uppercase tracking-wider border-2 border-red-800 shadow-[2px_2px_0px_0px_#381D2A] cursor-pointer transition-all"
            >
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Retention Notice Box */}
      <div className="flex items-center gap-3 p-3.5 bg-brand-cream-muted border-2 border-brand-border text-xs">
        <AlertTriangle className="w-4 h-4 text-brand-brown shrink-0" />
        <p className="font-semibold text-brand-violet/85">
          Encrypted blobs in trash still count toward your quota until permanently deleted.
        </p>
      </div>

      {/* Trash Table */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] overflow-hidden">
        {trashItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-brand-peach border-2 border-brand-violet mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#381D2A]">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-sm font-bold text-brand-violet">Trash is clean</h3>
            <p className="text-xs text-brand-violet/60 mt-1">
              No files are marked for deletion.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-cream-muted text-[10px] font-bold uppercase tracking-wider border-b-2 border-brand-border text-brand-violet">
                  <th className="py-3 px-4">Deleted File</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Deleted</th>
                  <th className="py-3 px-4">Purge Countdown</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {trashItems.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-cream-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-brown shrink-0" />
                        <span className="font-bold text-brand-violet">
                          {item.name}.{item.extension}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-brand-violet/80">
                      {formatFileSize(item.size)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-brand-violet/70">
                      {item.deletedAt}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-red-600 font-bold">
                      {item.expiresIn}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRestore(item.name, item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-cream-muted border border-brand-border hover:bg-brand-peach text-brand-violet font-bold text-xs cursor-pointer transition-colors"
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

