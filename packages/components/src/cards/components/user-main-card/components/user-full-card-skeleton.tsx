import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';

export const UserFullCardSkeleton = () => {
  return (
    <div
      className="flex flex-col h-[512px] gap-y-4 relative w-full rounded-lg p-4 bg-shark-950 border-[1px] border-white/10 items-center">
      <div className="flex items-center gap-4 w-full">
        <div className="flex relative justify-center p-2 items-center">
          <Skeleton className="w-[104px] h-[104px]" />
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Separator/>
      <div className="flex flex-col gap-y-4 items-center w-full">
        <div className="flex flex-col gap-y-1 w-full">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex flex-col gap-y-1 w-full">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-72" />
        </div>
      </div>
      <Separator />
    </div>
  );
};