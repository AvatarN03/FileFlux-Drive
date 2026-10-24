"use client";

import { useMemo, useState } from "react";
import { Clock, Search, FileText, Download, Eye } from "lucide-react";
import { useFiles } from "@/hooks/useFileQueries";
import { formatFileSize } from "@/lib/file";
import { FileModalProvider } from "@/context/FileModalContext";

interface RecentItem {
  id: string;
  name: string;
  extension: string;
  size: number;
  updatedAt: string;
}

const RecentPageContent = () => {
  const { data: rawFiles = [] } = useFiles({ folderId: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week">("all");

  // Mock static files to supplement if user has no files yet
  const mockRecentFiles: RecentItem[] = [
    {
      id: "mock-1",
      name: "Q4-Financial-Report",
      extension: "pdf",
      size: 4250000,
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "mock-2",
      name: "Production-Cluster-Architecture",
      extension: "png",
      size: 1850000,
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "mock-3",
      name: "User-Enrollment-Metrics",
      extension: "xlsx",
      size: 890000,
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mock-4",
      name: "Product-Demo-Walkthrough",
      extension: "mp4",
      size: 24500000,
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const displayList = useMemo<RecentItem[]>(() => {
    let items: RecentItem[] =
      rawFiles.length > 0
        ? rawFiles.map((f) => ({
            id: f.id,
            name: f.name,
            extension: f.extension,
            size: f.size,
            updatedAt: f.updatedAt || f.createdAt,
          }))
        : mockRecentFiles;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q)
      );
    }

    return items;
  }, [rawFiles, searchTerm]);

  const isStatic = rawFiles.length === 0;

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Clock className="w-3 h-3 text-brand-brown" />
            Chronological Activity Stream
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Recent Files
          </h1>
          <p className="text-xs text-brand-violet/75">
            Quickly locate assets you have uploaded, edited, or inspected recently.
          </p>
        </div>

        {isStatic && (
          <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
            Static Preview Mode
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-cream-muted border-2 border-brand-border p-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTimeFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              timeFilter === "all"
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
            }`}
          >
            All Activity
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("today")}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              timeFilter === "today"
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("week")}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              timeFilter === "week"
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
            }`}
          >
            This Week
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-3 text-brand-brown" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter recent files..."
            className="w-full pl-8 pr-3 py-1.5 bg-brand-cream border-2 border-brand-border text-xs font-semibold placeholder:text-brand-violet/40 focus:outline-none focus:border-brand-brown"
          />
        </div>
      </div>

      {/* Recent Files Table */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] overflow-hidden">
        <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-brand-violet bg-brand-cream-muted border-b-2 border-brand-border py-2.5 px-4">
          <span className="col-span-6 sm:col-span-5">File Name</span>
          <span className="hidden sm:block sm:col-span-3">Last Modified</span>
          <span className="col-span-3 sm:col-span-2 text-right">Size</span>
          <span className="col-span-3 sm:col-span-2 text-right">Actions</span>
        </div>

        <div className="divide-y divide-brand-border/60">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center py-3 px-4 hover:bg-brand-cream-muted/50 transition-colors text-xs font-medium"
            >
              <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 truncate pr-2">
                <div className="w-8 h-8 bg-brand-cream-muted border border-brand-border flex items-center justify-center text-brand-brown shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-brand-violet truncate">
                    {item.name}.{item.extension}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-brand-violet/60">
                    {item.extension}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block sm:col-span-3 text-[11px] font-mono text-brand-violet/70">
                {new Date(item.updatedAt).toLocaleString()}
              </div>

              <div className="col-span-3 sm:col-span-2 text-right text-[11px] font-mono text-brand-violet/80">
                {formatFileSize(item.size)}
              </div>

              <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  title="View"
                  className="p-1.5 bg-brand-cream-muted border border-brand-border hover:bg-brand-peach text-brand-violet transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Download"
                  className="p-1.5 bg-brand-brown text-brand-cream hover:bg-brand-brown-dark transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentPage = () => (
  <FileModalProvider>
    <RecentPageContent />
  </FileModalProvider>
);

export default RecentPage;
