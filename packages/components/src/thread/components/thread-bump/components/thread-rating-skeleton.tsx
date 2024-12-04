import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ThreadRatingSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Skeleton className="h-8 w-[120px]" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
};
