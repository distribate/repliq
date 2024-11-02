'use client';

import { friendsFilteringQuery } from '#friends/components/filtering/queries/friends-filtering-query.ts';
import { FriendsAllList } from '#friends/components/lists/components/friends-all-list.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendsOutgoingList } from '#friends/components/lists/components/friends-outgoing-list.tsx';
import { FriendsIncomingList } from '#friends/components/lists/components/friends-incoming-list.tsx';
import { FriendsSearchingList } from '#friends/components/lists/components/friends-searching-list.tsx';
import { Suspense } from 'react';
import { FriendsAllListSkeleton } from '#friends/components/lists/components/friends-all-list-skeleton.tsx';

export type FriendsListProps = Pick<UserEntity, "nickname">

export const FriendsList = ({
  nickname
}: FriendsListProps) => {
  const { data: friendsFilteringState } = friendsFilteringQuery();
  const currentListType = friendsFilteringState.listType;
  
  return (
    <Suspense fallback={<FriendsAllListSkeleton/>}>
      {currentListType === 'all' && (
        <FriendsAllList nickname={nickname}/>
      )}
      {currentListType === 'outgoing' && (
        <FriendsOutgoingList />
      )}
      {currentListType === 'incoming' && (
        <FriendsIncomingList />
      )}
      {currentListType === 'search' && (
        <FriendsSearchingList />
      )}
    </Suspense>
  );
};