import { Skeleton } from "@/components/ui/skeleton";

export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 bg-muted/50" />
            <Skeleton className="h-4 w-72 bg-muted/30" />
          </div>
          <Skeleton className="h-10 w-40 bg-purple-500/20" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg bg-muted/50" />
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 overflow-hidden">
              <Skeleton className="h-40 w-full bg-muted/50" />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-3/4 bg-muted/50" />
                    <Skeleton className="h-4 w-1/2 bg-muted/30" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-muted/50" />
                </div>
                <Skeleton className="h-3 w-full bg-muted/30" />
                <Skeleton className="h-3 w-4/5 bg-muted/30" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-8 flex-1 bg-muted/50" />
                  <Skeleton className="h-8 w-10 bg-muted/50" />
                  <Skeleton className="h-8 w-10 bg-muted/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
