"use client"

import { friendsFilteringQuery } from '../../filtering/queries/friends-filtering-query.ts';
import { requestsOutgoingQuery } from '../../../queries/requests-outgoing-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { FriendsListLayout } from './friends-list-layout.tsx';
import { FriendCardOutgoing } from '#friend/components/friend-card/components/friend-card-outgoing.tsx';

export const FriendsOutgoingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery()
  const { data: outgoingFriends } = requestsOutgoingQuery()

  if (!outgoingFriends
    || outgoingFriends && !outgoingFriends.length
  ) return <ContentNotFound title="Исходящих заявок в друзья нет"/>;
  
  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {outgoingFriends.map((friend) => (
        <FriendCardOutgoing key={friend.recipient} {...friend} />
      ))}
    </FriendsListLayout>
  );
};