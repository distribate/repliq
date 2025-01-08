import { Skeleton } from "@repo/ui/src/components/skeleton";

export const ProfileFriendsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <Skeleton className="h-10 w-36" />
        <div className="flex items-center gap-4 w-fit">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
      </div>
    </div>
  );
};