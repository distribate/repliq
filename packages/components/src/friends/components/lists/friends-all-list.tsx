'use client';

import { FriendsPinnedList } from './friends-pinned-list.tsx';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';
import { FriendCard } from '#friend/components/friend-card/components/friend-card.tsx';
import { friendsQuery, FriendsQuery } from '#friends/queries/friends-query.ts';
import { FriendsListProps } from '#friends/components/lists/friends-list.tsx';
import { friendsFilteringQuery } from '#friends/components/filtering/queries/friends-filtering-query.ts';
import { FriendsAllListSkeleton } from '#skeletons/friends-all-list-skeleton.tsx';

type FriendsNotPinnedListProps = {
  friends: FriendsQuery[]
}

const FriendsNotPinnedList = ({
  friends
}: FriendsNotPinnedListProps) => {
  return (
    friends.filter(f => !f.isPinned).map(friend => (
      <FriendCard key={friend.nickname} {...friend} />
    ))
  );
};

export const FriendsAllList = ({
  nickname,
}: FriendsListProps) => {
  const { data: friendsFiltering } = friendsFilteringQuery();
  const { data: friends, isLoading } = friendsQuery(nickname);
  
  if (isLoading) return <FriendsAllListSkeleton />;
  
  if (!friends) return <ContentNotFound title="Пока нет друзей ;(" />;
  
  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      <FriendsPinnedList nickname={nickname} />
      <FriendsNotPinnedList friends={friends} />
    </FriendsListLayout>
  );
};