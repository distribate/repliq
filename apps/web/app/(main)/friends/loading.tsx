import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { FriendsAllListSkeleton } from '@repo/components/src/skeletons/friends-all-list-skeleton.tsx';

const FriendsPageSkeleton = async() => {
  return (
    <div className="flex flex-col gap-2 items-start lg:flex-row w-full h-full relative">
      <BlockWrapper className="flex w-4/6 *:w-full !p-4 h-full">
        <div className="flex flex-col w-full h-full gap-4">
          <Skeleton className="w-full h-14" />
          <FriendsAllListSkeleton />
        </div>
      </BlockWrapper>
      <div className="flex flex-col gap-4 w-2/6 sticky top-0 h-fit">
        <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </BlockWrapper>
      </div>
    </div>
  );
};

export default function FriendsLoadingPage() {
  return (
    <FriendsPageSkeleton />
  );
}