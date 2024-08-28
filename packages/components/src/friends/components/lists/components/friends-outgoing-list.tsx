"use client"

import { friendsFilteringQuery } from '../../filtering/queries/friends-filtering-query.ts';
import { requestsOutgoingQuery } from '../../../queries/requests-outgoing-query.ts';
import { ContentNotFound } from '../../../../templates/section-not-found.tsx';
import {
  FriendRequestOutgoingCard
} from '../../../../friend/components/request-card/components/friend-request-card-outgoing.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';

export const FriendsOutgoingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery()
  const { data: outgoingFriends } = requestsOutgoingQuery()

  if (!outgoingFriends
    || outgoingFriends && !outgoingFriends.length
  ) return <ContentNotFound title="Исходящих заявок в друзья нет"/>;
  
  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {outgoingFriends.map((friend) => (
        <FriendRequestOutgoingCard key={friend.recipient} {...friend} />
      ))}
    </FriendsListLayout>
  );
};