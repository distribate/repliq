import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const ThreadImagesSkeleton = () => {
  return (
    <div className="flex items-start w-full gap-2">
      <Skeleton className="w-[300px] h-[150px] rounded-md" />
      <Skeleton className="w-[300px] h-[150px] rounded-md" />
    </div>
  );
};