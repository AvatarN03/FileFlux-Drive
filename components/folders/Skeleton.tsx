
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const GetFoldersSkeleton = () => {
  return (
    <div
      role="status"
      aria-label="Loading folders"
      className="border-2 border-brand-border bg-brand-cream"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-brand-border bg-brand-cream-muted hover:bg-brand-cream-muted">
            <TableHead className="px-3 py-3 sm:px-4">
              <div className="h-2.5 w-16 animate-pulse bg-brand-border/70" />
            </TableHead>
            <TableHead className="w-0 px-3 py-3 sm:px-4">
              <div className="ml-auto h-2.5 w-16 animate-pulse bg-brand-border/70" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow
              key={index}
              className="animate-pulse border-brand-border bg-brand-cream hover:bg-brand-cream"
            >
              <TableCell className="px-3 py-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-9 w-9 shrink-0 border border-brand-violet/30 bg-brand-peach/60" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-brand-border" />
                    <div className="h-2 w-1/2 bg-brand-border/70" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-0 px-3 py-3 sm:px-4">
                <div className="h-8 w-8 border-2 border-brand-border bg-brand-cream-muted md:hidden" />
                <div className="hidden justify-end gap-2 md:flex">
                  <div className="h-8 w-8 border-2 border-brand-border bg-brand-cream-muted" />
                  <div className="h-8 w-8 border-2 border-brand-border bg-brand-cream-muted" />
                  <div className="h-8 w-8 border-2 border-brand-border bg-brand-cream-muted" />
                  <div className="h-8 w-8 border-2 border-brand-border bg-brand-cream-muted" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
