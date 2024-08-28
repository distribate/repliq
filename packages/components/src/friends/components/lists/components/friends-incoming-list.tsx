'use client';

import { friendsFilteringQuery } from '../../filtering/queries/friends-filtering-query.ts';
import { requestsIncomingQuery } from '../../../queries/requests-incoming-query.ts';
import { ContentNotFound } from '../../../../templates/section-not-found.tsx';
import {
  FriendRequestIncomingCard
} from '../../../../friend/components/request-card/components/friend-request-card-incoming.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';

export const FriendsIncomingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery()
  const { data: incomingFriends } = requestsIncomingQuery();
  
  if (!incomingFriends
    || incomingFriends && !incomingFriends.length
  ) return <ContentNotFound title="Входящих заявок в друзья нет" />;
  
  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {incomingFriends.map(friend => (
        <FriendRequestIncomingCard key={friend.initiator} {...friend} />
      ))}
    </FriendsListLayout>
  );
};