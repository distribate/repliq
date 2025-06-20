import { UserCoverSkeleton } from "#components/skeletons/components/user-cover-skeleton";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { UserPostsSkeleton } from "#components/skeletons/components/user-posts-skeleton";

export const UserContentSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-12 h-full lg:px-16 relative z-[4]">
      <div className="flex flex-col gap-6 w-full h-full">
        <div className="flex flex-col min-w-[400px] w-full">
          <div className="flex flex-row items-center justify-start gap-2">
            <Skeleton className="w-20 h-12" />
            <Skeleton className="w-20 h-12" />
            <Skeleton className="w-24 h-12" />
            <Separator orientation="vertical" />
            <Skeleton className="w-44 h-12" />
            <Skeleton className="w-36 h-12" />
            <Separator orientation="vertical" />
            <Skeleton className="w-32 h-12" />
          </div>
          <UserPostsSkeleton />
        </div>
      </div>
    </div>
  );
};

export const UserProfileSkeleton = () => {
  return (
    <div className="flex flex-col w-full relative pb-12">
      <UserCoverSkeleton />
      <UserContentSkeleton />
    </div>
  );
};
