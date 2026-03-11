import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-white/[0.06]" />
            <Skeleton className="h-4 w-64 bg-white/[0.04]" />
          </div>
          <Skeleton className="h-10 w-32 bg-white/[0.06]" />
        </div>

        {/* Search + filters */}
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 bg-white/[0.06]" />
          <Skeleton className="h-10 w-32 bg-white/[0.06]" />
          <Skeleton className="h-10 w-32 bg-white/[0.06]" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-white/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 bg-white/[0.08]" />
            ))}
          </div>
          {/* Data rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full bg-white/[0.06]" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 bg-white/[0.06]" />
                  <Skeleton className="h-3 w-16 bg-white/[0.04]" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 my-auto bg-white/[0.06]" />
              <Skeleton className="h-6 w-16 rounded-full my-auto bg-white/[0.06]" />
              <Skeleton className="h-6 w-12 rounded-full my-auto bg-white/[0.06]" />
              <Skeleton className="h-4 w-24 my-auto bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
