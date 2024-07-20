import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const FavoriteItemsSkeleton = () => {
  return (
    <div className="grid grid-flow-col grid-rows-4 overflow-y-scroll max-h-[540px] gap-2 w-full">
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
    </div>
  );
};