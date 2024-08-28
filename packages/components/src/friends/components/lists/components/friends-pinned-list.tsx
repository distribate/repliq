import { FriendCard } from '../../../../friend/components/friend-card/friend-card.tsx';
import type { FriendsQuery } from '../../../queries/friends-query.ts';

type FriendsPinnedListProps = {
  pinnedFriends: FriendsQuery[]
}

export const FriendsPinnedList = ({
  pinnedFriends
}: FriendsPinnedListProps) => {
  if (!pinnedFriends || pinnedFriends && !pinnedFriends.length) {
    return null;
  }
  
  return (
    pinnedFriends.map(friend => (
      <FriendCard key={friend.friend_id} {...friend} />
    ))
  );
};