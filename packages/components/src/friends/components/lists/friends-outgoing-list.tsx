"use client";

import { ContentNotFound } from "#templates/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCardOutgoing } from "#friend/components/friend-card/components/friend-card-outgoing.tsx";
import { friendsFilteringQuery } from "#friends/components/filtering/queries/friends-filtering-query.ts";
import { requestsOutgoingQuery } from "#friends/queries/requests-outgoing-query.ts";

export const FriendsOutgoingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery();
  const { data: outgoingFriends } = requestsOutgoingQuery();

  if (!outgoingFriends || (outgoingFriends && !outgoingFriends.length))
    return <ContentNotFound title="Исходящих заявок в друзья нет" />;

  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {outgoingFriends.map((friend) => (
        <FriendCardOutgoing key={friend.recipient} request_id={friend.id} recipient={friend.recipient} />
      ))}
    </FriendsListLayout>
  );
};
