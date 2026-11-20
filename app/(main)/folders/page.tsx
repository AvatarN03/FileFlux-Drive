import FolderGrid from "@/components/folders/FolderGrid";
import FolderHeader from "@/components/folders/FolderHeader";

const FolderPage = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-6 overflow-hidden p-4 sm:p-6 lg:p-8 text-brand-violet">
      <FolderHeader title="Root Workspaces & Folders" />
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
        <FolderGrid />
      </div>
    </div>
  );
};

export default FolderPage;
