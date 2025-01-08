import { Skeleton } from "@repo/ui/src/components/skeleton";

export const MainCategoriesSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </>
  );
};