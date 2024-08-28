import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const ThreadImagesSkeleton = () => {
  return (
    <div className="flex items-start w-full gap-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="w-[300px] h-[150px]" />
      ))}
    </div>
  );
};