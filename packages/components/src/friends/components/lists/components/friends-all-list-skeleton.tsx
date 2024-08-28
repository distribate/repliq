import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { FriendCardSkeleton } from '../../../../friend/components/friend-card/friend-card-skeleton.tsx';

export const FriendsAllListSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28"/>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-5 !rounded-full"/>
          <Skeleton className="h-6 w-36"/>
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <FriendCardSkeleton key={i} />
      ))}
    </div>
  );
};