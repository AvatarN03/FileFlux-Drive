
export const GetFoldersSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex h-15 w-50 items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3"
        >
          <div className="h-5 w-5 animate-pulse rounded bg-slate-700" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-700" />
        </div>
      ))}
    </div>
  );
};