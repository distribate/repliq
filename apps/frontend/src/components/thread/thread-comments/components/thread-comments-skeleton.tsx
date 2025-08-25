import { Skeleton } from "@repo/ui/src/components/skeleton";

export const ThreadCommentsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 items-center w-full">
      <Skeleton className="h-8 w-44" />
      <div className="flex flex-col items-start gap-y-2 w-full">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    </div>
  );
};