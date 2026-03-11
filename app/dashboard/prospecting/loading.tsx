import { Skeleton } from "@/components/ui/skeleton";

export default function ProspectingLoading() {
  return (
    <div className="min-h-screen bg-[#050505] p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg bg-purple-500/20" />
              <Skeleton className="h-8 w-56 bg-white/[0.06]" />
            </div>
            <Skeleton className="h-4 w-80 bg-white/[0.04]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 bg-white/[0.06]" />
            <Skeleton className="h-10 w-28 bg-white/[0.06]" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <Skeleton className="h-3.5 w-20 bg-white/[0.06]" />
              <Skeleton className="h-7 w-16 bg-white/[0.08]" />
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 flex-1 min-w-[200px] bg-white/[0.06]" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-36 bg-white/[0.06]" />
          ))}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg bg-white/[0.06] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-64 bg-white/[0.06]" />
                  <Skeleton className="h-5 w-20 rounded-full bg-green-500/20" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-3.5 w-32 bg-white/[0.04]" />
                  <Skeleton className="h-3.5 w-24 bg-white/[0.04]" />
                  <Skeleton className="h-3.5 w-20 bg-white/[0.04]" />
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Skeleton className="h-9 w-24 bg-white/[0.06]" />
                <Skeleton className="h-9 w-9 bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
