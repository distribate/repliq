import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ThreadReactionsSkeleton = () => {
  return (
    <div className="flex items-center w-full gap-2">
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-12" />
    </div>
  );
};
