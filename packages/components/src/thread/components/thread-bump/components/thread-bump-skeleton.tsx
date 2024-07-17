import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const ThreadBumpSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Skeleton className="rounded-md h-8 w-[120px]" />
      <Skeleton className="rounded-md h-2 w-full" />
    </div>
  );
};