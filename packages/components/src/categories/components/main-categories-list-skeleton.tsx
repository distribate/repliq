import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const MainCategoriesListSkeleton = async() => {
  return (
    <div className="flex lg:flex-row flex-col w-full h-full">
      <div className="flex flex-col w-full pr-4 gap-4 min-h-[400px] h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/3 h-full">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-[260px] w-full" />
        ))}
      </div>
    </div>
  );
};