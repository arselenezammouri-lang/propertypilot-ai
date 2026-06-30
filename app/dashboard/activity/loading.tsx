import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-9 w-[120px]" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
