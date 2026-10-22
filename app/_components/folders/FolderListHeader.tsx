import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Plus, ChevronRight } from "lucide-react";
import { FolderListHeaderProps } from "@/types/ui";

const FolderListHeader = ({ onAddClick, folderName, folderPath }: FolderListHeaderProps) => {
  const hasPath = folderPath && folderPath.length > 0;

  const [showOverflow, setShowOverflow] = useState(false);
  const overflowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setShowOverflow(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowOverflow(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Responsive limits
  const mobileLimit = 2;
  const desktopLimit = 4;

  const path = folderPath ?? [];

  const mobileVisible = path.slice(-mobileLimit);
  const mobileOverflow = path.length > mobileLimit ? path.slice(0, path.length - mobileVisible.length) : [];

  const desktopVisible = path.slice(-desktopLimit);
  const desktopOverflow = path.length > desktopLimit ? path.slice(0, path.length - desktopVisible.length) : [];

  const renderLastTruncated = (name: string) => (
    <div className="text-base md:text-xl text-brown  md:max-w-xl">
      <div className="truncate" style={{ direction: "rtl" }}>
        <span style={{  display: "inline-block" }}>{name}</span>
      </div>
    </div>
  );

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-center items-center gap-4 md:gap-8">
        <div className="flex items-center gap-3">
          {!hasPath ? (
            <h1 className="text-base md:text-xl text-brown">{folderName ?? "Folders"}</h1>
          ) : (
            <div className="flex items-center gap-2">
              {/* Mobile view: show last 2, overflow menu at start */}
              <div className="flex items-center gap-2 sm:hidden truncate">
                {mobileOverflow.length > 0 && (
                  <div className="relative" ref={overflowRef}>
                    <button
                      onClick={() => setShowOverflow((s) => !s)}
                      aria-label="Show breadcrumbs"
                      className="px-1"
                    >
                      &#8230;
                    </button>

                    {showOverflow && (
                      <div className="absolute left-0 mt-2 bg-peach rounded-lg shadow p-2 z-50">
                        {mobileOverflow.map((p) => (
                          <Link
                            key={p.id}
                            href={`/folders/${p.id}`}
                            onClick={() => setShowOverflow(false)}
                            className="block px-2 py-1 hover:underline"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {mobileVisible.map((p, idx) => (
                  <span key={p.id} className={`flex items-center gap-2 text-sm `}>
                    <Link href={`/folders/${p.id}`} className="hover:underline ">
                      {p.name}
                    </Link>
                    {idx !== mobileVisible.length - 1 && <ChevronRight className="w-3 h-3" />}
                  </span>
                ))}
              </div>

              {/* Desktop view: show last 4, overflow menu at start */}
              <div className="hidden sm:flex items-center gap-2">
                {desktopOverflow.length > 0 && (
                  <div className="relative" ref={overflowRef}>
                    <button
                      onClick={() => setShowOverflow((s) => !s)}
                      aria-label="Show breadcrumbs"
                      className="px-1"
                    >
                      &#8230;
                    </button>

                    {showOverflow && (
                      <div className="absolute left-0 mt-2 bg-peach rounded-lg shadow p-2 z-50">
                        {desktopOverflow.map((p) => (
                          <Link
                            key={p.id}
                            href={`/folders/${p.id}`}
                            onClick={() => setShowOverflow(false)}
                            className="block px-2 py-1 hover:underline"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {desktopVisible.slice(0, -1).map((p) => (
                  <span key={p.id} className="flex items-center gap-2 text-sm md:text-base ">
                    <Link href={`/folders/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                ))}

                {/* last (child) - truncate at start if very long */}
                {desktopVisible.length > 0 && renderLastTruncated(desktopVisible[desktopVisible.length - 1].name)}
              </div>
            </div>
          )}

        </div>
      </div>
          <div
            className="flex justify-center items-center md:gap-1 bg-brown hover:bg-peach cursor-pointer p-1 md:p-2 rounded-xl"
            onClick={onAddClick}
          >
            <Plus className="text-violet w-4 h-4 md:w-5 md:h-5" />
            <h1 className="text-violet text-sm md:text-base">Add Folder</h1>
          </div>
    </div>
  );
};

export default FolderListHeader;