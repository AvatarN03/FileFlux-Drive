import { Loader2, Search, X } from "lucide-react";
import { FileCategoryFilter } from "@/types/file";

const CATEGORY_TABS: { label: string; value: FileCategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Documents", value: "document" },
  { label: "Sheets", value: "spreadsheet" },
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
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl md:text-2xl xl:text-4xl font-semibold text-violet">
            {title}
          </h1>
          {isFetching && (
            <span className="text-xs text-violet px-2 py-1.5 rounded-md bg-brown flex gap-2 items-center">
              <Loader2 className="h-3 w-3 text-violet animate-spin" strokeWidth={2} />
              Updating…
            </span>
          )}
        </div>


        {/* Search */}
       <div className="relative flex-1 w-full md:max-w-xl">
  <div className="relative bg-peach text-violet flex items-center rounded-lg border border-brown/30 focus-within:ring-2 focus-within:ring-ember transition">
    <Search
      size={18}
      className="absolute left-3 text-violet/50"
    />
    <input
      type="text"
      value={searchInput}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search files..."
      className="w-full pl-10 pr-10 py-2.5 bg-transparent placeholder:text-violet/40 focus:outline-none"
    />
    {searchInput && (
      <button
        onClick={() => onSearchChange('')}
        className="absolute right-3 text-violet/50 hover:text-violet transition-colors"
        aria-label="Clear search"
      >
        <X size={18} />
      </button>
    )}
  </div>
</div>
      </div>

      {/* Category filter tabs */}
      <div className="min-w-0">

        <div className="flex gap-2 overflow-x-auto  md:justify-end w-full pb-2 horizontal-scroll">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                onSearchChange('')
                onCategoryChange(tab.value)
              }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer
            ${category === tab.value
                  ? "bg-violet text-peach"
                  : "bg-peach text-violet hover:bg-brown/60 border border-brown/20"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileHeader;