import { Skeleton } from "@/components/ui/skeleton";

export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-[#050505] p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 bg-white/[0.06]" />
            <Skeleton className="h-4 w-72 bg-white/[0.04]" />
          </div>
          <Skeleton className="h-10 w-40 bg-purple-500/20" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg bg-white/[0.06]" />
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <Skeleton className="h-40 w-full bg-white/[0.06]" />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-3/4 bg-white/[0.06]" />
                    <Skeleton className="h-4 w-1/2 bg-white/[0.04]" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
                </div>
                <Skeleton className="h-3 w-full bg-white/[0.04]" />
                <Skeleton className="h-3 w-4/5 bg-white/[0.04]" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-8 flex-1 bg-white/[0.06]" />
                  <Skeleton className="h-8 w-10 bg-white/[0.06]" />
                  <Skeleton className="h-8 w-10 bg-white/[0.06]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
