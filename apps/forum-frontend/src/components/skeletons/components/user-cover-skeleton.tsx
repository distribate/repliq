import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const UserCoverSkeleton = () => {
  return (
    <Skeleton className="flex w-full items-center rounded-lg justify-between bg-shark-950 z-[3] px-12 py-6 min-h-[414px] h-[414px] max-h-[414px]">
      <div className="flex gap-x-6 relative items-center">
        <Skeleton className="overflow-hidden h-[168px] w-[168px]" />
        <div className="flex flex-col self-end justify-between h-1/2 gap-y-2">
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-center gap-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="flex">
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      </div>
    </Skeleton>
  );
};
