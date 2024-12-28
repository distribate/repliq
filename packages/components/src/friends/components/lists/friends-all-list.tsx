"use client";

import { FriendsPinnedList } from "./friends-pinned-list.tsx";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCard } from "#friend/components/friend-card/components/friend-card.tsx";
import { friendsQuery } from "#friends/queries/friends-query.ts";
import { FriendsListProps } from "#friends/components/lists/friends-list.tsx";
import { friendsFilteringQuery } from "#friends/components/filtering/queries/friends-filtering-query.ts";
import { FriendsAllListSkeleton } from "#skeletons/friends-all-list-skeleton.tsx";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";

type FriendsNotPinnedListProps = {
  friends: FriendWithDetails[];
};

const FriendsNotPinnedList = ({ friends }: FriendsNotPinnedListProps) => {
  return friends
    .filter((f) => !f.is_pinned)
    .map((friend) => <FriendCard key={friend.nickname} {...friend} />);
};

export const FriendsAllList = ({ nickname }: FriendsListProps) => {
  const { data: friendsFiltering } = friendsFilteringQuery();
  const { data: friends, isLoading } = friendsQuery({
    nickname,
    with_details: true,
  });

  if (isLoading) return <FriendsAllListSkeleton />;

  if (!friends) return <ContentNotFound title="Пока нет друзей ;(" />;

  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      <FriendsPinnedList nickname={nickname} />
      <FriendsNotPinnedList friends={friends as FriendWithDetails[]} />
    </FriendsListLayout>
  );
};
