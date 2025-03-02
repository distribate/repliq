import { UserCoverSkeleton } from "#components/skeletons/user-cover-skeleton.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { UserPostsSkeleton } from "#components/skeletons/user-posts-skeleton.tsx";

export const UserContentSkeleton = () => {
  return (
    <div className="flex w-full h-full gap-12 px-12  relative z-[4]">
      <div className="flex flex-col grow w-fit">
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
      <div className="flex flex-col w-1/3 h-full">
        <div className="flex w-[500px] h-[500px] gap-2">
          <Skeleton className="w-[100px] h-1/2" />
          <Skeleton className="w-full h-[500px]" />
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
