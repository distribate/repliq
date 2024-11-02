'use client';

import { FriendsPinnedList } from './friends-pinned-list.tsx';
import { FriendsAllListSkeleton } from './friends-all-list-skeleton.tsx';
import { friendsFilteringQuery } from '../../filtering/queries/friends-filtering-query.ts';
import { FriendsQuery, friendsQuery } from '../../../queries/friends-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';
import { FriendsListProps } from '#friends/components/lists/components/friends-list.tsx';
import { FriendCard } from '#friend/components/friend-card/components/friend-card.tsx';

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