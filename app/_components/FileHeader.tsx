import { Loader2, Search, X } from "lucide-react";
import { FileCategoryFilter } from "@/types/file";

const CATEGORY_TABS: { label: string; value: FileCategoryFilter }[] = [
  { label: "All Items", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Documents", value: "document" },
  { label: "Spreadsheets", value: "spreadsheet" },
  { label: "Other", value: "other" },
];

interface FileHeaderProps {
  title: string;
  isFetching?: boolean;
  searchInput: string;
  onSearchChange: (value: string) => void;
  category: FileCategoryFilter;
  onCategoryChange: (category: FileCategoryFilter) => void;
}

const FileHeader = ({
  title,
  isFetching,
  searchInput,
  onSearchChange,
  category,
  onCategoryChange,
}: FileHeaderProps) => {
  return (
    <div className="space-y-4 text-brand-violet">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {title}
          </h1>
          {isFetching && (
            <span className="text-[11px] font-mono text-brand-violet px-2 py-1 bg-brand-peach border border-brand-violet flex items-center gap-1.5 font-bold">
              <Loader2 className="h-3 w-3 animate-spin text-brand-brown" strokeWidth={2.5} />
              Syncing…
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="relative bg-brand-cream-muted text-brand-violet flex items-center border-2 border-brand-border focus-within:border-brand-brown transition">
            <Search size={16} className="absolute left-3 text-brand-brown shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search files by name..."
              className="w-full pl-9 pr-9 py-2 bg-transparent text-xs font-semibold placeholder:text-brand-violet/40 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 text-brand-violet/60 hover:text-brand-violet transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 horizontal-scroll">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              onSearchChange("");
              onCategoryChange(tab.value);
            }}
            className={`shrink-0 px-3.5 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
              category === tab.value
                ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
                : "bg-brand-cream-muted text-brand-violet border-brand-border hover:bg-brand-cream"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileHeader;
