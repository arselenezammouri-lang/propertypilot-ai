import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
