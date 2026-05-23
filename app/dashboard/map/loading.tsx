import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-muted/50" />
        <Skeleton className="h-4 w-48 bg-muted/30" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-muted/30 p-6 space-y-3">
            <Skeleton className="h-6 w-32 bg-muted/50" />
            <Skeleton className="h-4 w-full bg-muted/30" />
            <Skeleton className="h-4 w-3/4 bg-muted/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
