import type { KeyboardEvent } from "react";

import { FolderPlus, Star, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

import { FOLDER_COLOR_OPTIONS } from "@/types/folder";

type AddFolderModalProps = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onClose: () => void;
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  isPending: boolean;
  showFolderOptions?: boolean;
  showColorOption?: boolean;
  color?: string;
  onColorChange?: (color: string) => void;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  title?: string;
  submitLabel?: string;
};

const AddFolderModal = ({
  value,
  onChange,
  onAdd,
  onClose,
  onKeyPress,
  isPending,
  showFolderOptions = false,
  showColorOption = false,
  color,
  onColorChange,
  isFavorite = false,
  onFavoriteChange,
  title = "Create New Folder",
  submitLabel = "Create Folder",
}: AddFolderModalProps) => {
  const selectedColor =
    FOLDER_COLOR_OPTIONS.find((option) => option.value === color) ??
    FOLDER_COLOR_OPTIONS[0];
  const shouldShowColorOption = showFolderOptions || showColorOption;

  return (
    <div
      className="fixed inset-0 bg-brand-violet-dark/60 backdrop-blur-xs flex justify-center items-center z-50 p-4"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <div
        className="max-w-md w-full bg-brand-cream border-2 border-brand-violet shadow-brown-8 p-6 flex flex-col justify-between animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b-2 border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-peach border border-brand-violet flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-brand-brown" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-brand-violet tracking-tight">
                {title}
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

          {shouldShowColorOption && (
            <div className={showFolderOptions ? "grid gap-4 sm:grid-cols-2" : "flex"}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Folder Color
                </label>
                <Select
                  value={selectedColor.value}
                  onValueChange={(nextColor) => {
                    if (nextColor) onColorChange?.(nextColor);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger className="h-10 w-full rounded-none border-2 border-brand-border bg-brand-cream-muted px-3 text-xs font-bold text-brand-violet shadow-none focus:border-brand-brown focus:ring-0">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 shrink-0 border border-brand-violet"
                        style={{ backgroundColor: selectedColor.value }}
                      />
                      <span className="truncate">{selectedColor.label}</span>
                    </span>
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-brand-violet bg-brand-cream text-brand-violet">
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

              {showFolderOptions && (
                <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Favorite
                </span>
                <Toggle
                  type="button"
                  pressed={isFavorite}
                  onPressedChange={onFavoriteChange}
                  disabled={isPending}
                  variant="outline"
                  aria-label="Add folder to favorites"
                  className="h-10 w-full justify-start gap-2 rounded-none border-2 border-brand-border bg-brand-cream-muted px-3 text-xs font-bold text-brand-violet shadow-none hover:bg-brand-peach hover:text-brand-violet data-[state=on]:border-brand-brown data-[state=on]:bg-brand-peach data-[state=on]:text-brand-brown"
                >
                  <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                  Add to favorites
                </Toggle>
                </div>
              )}
            </div>
          )}

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
              className="px-5 py-2 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-brown shadow-violet-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
