import { AddFolderModalProps } from "@/types/folder";
import { FolderPlus, X } from "lucide-react";

const AddFolderModal = ({
  value,
  onChange,
  onAdd,
  onClose,
  onKeyPress,
  isPending,
}: AddFolderModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-brand-violet-dark/60 backdrop-blur-xs flex justify-center items-center z-50 p-4"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <div
        className="max-w-md w-full bg-brand-cream border-2 border-brand-violet shadow-[8px_8px_0px_0px_#BA5624] p-6 flex flex-col justify-between animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b-2 border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-peach border border-brand-violet flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-brand-brown" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-brand-violet tracking-tight">
                Create New Folder
              </h2>
              <p className="text-xs text-brand-violet/70">
                Organize your encrypted assets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1 hover:bg-brand-cream-muted text-brand-violet border border-transparent hover:border-brand-border transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Folder Name
            </label>
            <input
              type="text"
              autoFocus
              value={value}
              disabled={isPending}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyPress}
              placeholder="e.g. Invoices 2026, Client Work..."
              className="w-full px-3.5 py-2.5 bg-brand-cream-muted border-2 border-brand-border focus:border-brand-brown text-brand-violet text-sm font-semibold focus:outline-none placeholder:text-brand-violet/40"
            />
            {value.trim().length > 0 && value.trim().length < 3 && (
              <p className="text-[11px] text-red-600 font-bold mt-1">
                Folder name must be at least 3 characters.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-brand-border">
            <button
              type="button"
              className="px-4 py-2 border-2 border-brand-border bg-brand-cream-muted hover:bg-brand-cream text-brand-violet text-xs font-bold transition cursor-pointer"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onAdd}
              disabled={isPending || !value.trim() || value.trim().length < 3}
              className="px-5 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
