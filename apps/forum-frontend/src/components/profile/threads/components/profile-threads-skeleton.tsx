import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const ProfileThreadsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <div className="flex items-center gap-4 w-fit">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 w-full">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    </div>
  );
};