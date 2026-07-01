import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return <div className="p-6 max-w-3xl mx-auto space-y-6"><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-[300px] w-full rounded-xl" /></div>;
}
