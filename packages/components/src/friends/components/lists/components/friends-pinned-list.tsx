import { friendsQuery, FriendsQuery } from '../../../queries/friends-query.ts';
import { FriendCard } from '#friend/components/friend-card/components/friend-card.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendsAllListSkeleton } from '#friends/components/lists/components/friends-all-list-skeleton.tsx';

type FriendsPinnedListProps = Pick<UserEntity, "nickname">

export const FriendsPinnedList = ({
  nickname
}: FriendsPinnedListProps) => {
  const { data: friends, isLoading } = friendsQuery(nickname);
  
  if (isLoading) return <FriendsAllListSkeleton />;
  
  const pinnedFriends = friends?.filter(f => f.isPinned) || null;
  
  if (!pinnedFriends || pinnedFriends && !pinnedFriends.length) {
    return null;
  }
  
  return (
    pinnedFriends.map(friend => (
      <FriendCard key={friend.friend_id} {...friend} />
    ))
  );
};