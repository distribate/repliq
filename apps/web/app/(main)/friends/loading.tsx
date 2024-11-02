import {
  FriendsAllListSkeleton,
} from '@repo/components/src/friends/components/lists/components/friends-all-list-skeleton.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper.tsx';

export default function FriendsLoadingPage() {
  return (
    <PageWrapper className="p-6">
      <div className="flex flex-col gap-4 pr-2 pl-0 py-2 items-start lg:flex-row w-full h-full relative">
        <div className="flex w-2/3 *:w-full">
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-full h-36" />
              <FriendsAllListSkeleton />
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-1/3" />
      </div>
    </PageWrapper>
  );
}