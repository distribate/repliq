import { FriendCard } from "#friend/components/friend-card/components/friend-card.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { friendsQuery } from "#friends/queries/friends-query.ts";
import { FriendsAllListSkeleton } from "#skeletons/friends-all-list-skeleton.tsx";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types";

type FriendsPinnedListProps = Pick<UserEntity, "nickname">;

export const FriendsPinnedList = ({ nickname }: FriendsPinnedListProps) => {
  const { data, isLoading } = friendsQuery({ nickname });

  const friends = data as FriendWithDetails[];

  if (isLoading) return <FriendsAllListSkeleton />;

  const pinnedFriends = friends?.filter((f) => f.is_pinned) || null;

  if (!pinnedFriends || (pinnedFriends && !pinnedFriends.length)) {
    return null;
  }

  return pinnedFriends.map((friend) => (
    // @ts-ignore
    <FriendCard key={friend.friend_id} {...friend} />
  ));
};
