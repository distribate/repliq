import { FriendCardSkeleton } from '#friend/components/friend-card/components/friend-card-skeleton.tsx';

export const FriendsAllListSkeleton = () => {
  return (
    <>
      <FriendCardSkeleton />
      <FriendCardSkeleton />
      <FriendCardSkeleton />
      <FriendCardSkeleton />
      <FriendCardSkeleton />
    </>
  );
};