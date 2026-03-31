import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page header skeleton */}
        <div className="flex items-center justify-between pt-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-muted/50" />
            <Skeleton className="h-4 w-48 bg-muted/30" />
          </div>
          <Skeleton className="h-10 w-32 bg-muted/50" />
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-muted/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 bg-muted/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-muted/50" />
              </div>
              <Skeleton className="h-8 w-20 bg-muted/60" />
              <Skeleton className="h-3 w-32 bg-muted/30" />
            </div>
          ))}
        </div>

        {/* Main content area skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large card */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-muted/30 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-6 w-40 bg-muted/50" />
              <Skeleton className="h-8 w-24 bg-muted/50" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
                <Skeleton className="h-10 w-10 rounded-full bg-muted/50 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-muted/50" />
                  <Skeleton className="h-3 w-1/2 bg-muted/30" />
                </div>
                <Skeleton className="h-6 w-16 bg-muted/50" />
              </div>
            ))}
          </div>

          {/* Side card */}
          <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-4">
            <Skeleton className="h-6 w-32 bg-muted/50" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-full bg-muted/30" />
                  <Skeleton className="h-2 w-full rounded-full bg-muted/50" />
                </div>
              ))}
            </div>
            <div className="pt-4 space-y-2">
              <Skeleton className="h-10 w-full bg-muted/50" />
              <Skeleton className="h-10 w-full bg-muted/30" />
            </div>
          </div>
        </div>

        {/* Bottom row skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-6 space-y-4">
              <Skeleton className="h-6 w-40 bg-muted/50" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg bg-muted/50" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-3/4 bg-muted/50" />
                      <Skeleton className="h-3 w-1/2 bg-muted/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
