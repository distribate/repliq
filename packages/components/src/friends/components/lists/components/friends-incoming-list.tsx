'use client';

import { friendsFilteringQuery } from '../../filtering/queries/friends-filtering-query.ts';
import { requestsIncomingQuery } from '../../../queries/requests-incoming-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';
import { FriendCardIncoming } from '#friend/components/friend-card/components/friend-card-incoming.tsx';

export const FriendsIncomingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery()
  const { data: incomingFriends } = requestsIncomingQuery();
  
  if (!incomingFriends
    || incomingFriends && !incomingFriends.length
  ) return <ContentNotFound title="Входящих заявок в друзья нет" />;
  
  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {incomingFriends.map(friend => (
        <FriendCardIncoming key={friend.initiator} {...friend} />
      ))}
    </FriendsListLayout>
  );
};