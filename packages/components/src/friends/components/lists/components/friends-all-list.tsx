'use client';

import { FriendsPinnedList } from './friends-pinned-list.tsx';
import { FriendsAllListSkeleton } from './friends-all-list-skeleton.tsx';
import { USER } from '@repo/types/entities/entities-type.ts';
import { friendsFilteringQuery } from '../../filtering/queries/friends-filtering-query.ts';
import { friendsQuery } from '../../../queries/friends-query.ts';
import { ContentNotFound } from '../../../../templates/section-not-found.tsx';
import { FriendCard } from '../../../../friend/components/friend-card/friend-card.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';

type FriendsAllListProps = Pick<USER, 'nickname'>

export const FriendsAllList = ({
  nickname
}: FriendsAllListProps) => {
  const { data: friendsFiltering } = friendsFilteringQuery()
  const { data: friends, isLoading } = friendsQuery({ nickname });
  
  if (isLoading) return <FriendsAllListSkeleton />;
  if (!friends) return <ContentNotFound title="Пока нет друзей ;(" />;
  
  const pinnedFriends = friends.filter(f => f.isPinned) || null;
  
  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      <FriendsPinnedList pinnedFriends={pinnedFriends} />
      {friends.filter(f => !f.isPinned).map(friend => (
        <FriendCard key={friend.nickname} {...friend} />
      ))}
    </FriendsListLayout>
  );
};