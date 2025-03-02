import { ContentNotFound } from "#components/templates/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCardIncoming } from "#components/friend/components/friend-card-incoming.tsx";
import { friendsFilteringQuery } from "#components/friends/components/filtering/queries/friends-filtering-query.ts";
import { requestsIncomingQuery } from "#components/friends/queries/requests-incoming-query.ts";

export const FriendsIncomingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery();
  const { data: incomingFriends } = requestsIncomingQuery();

  if (!incomingFriends) {
    return <ContentNotFound title="Входящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {incomingFriends.map(friend => (
        <FriendCardIncoming key={friend.initiator} request_id={friend.id} {...friend} />
      ))}
    </FriendsListLayout>
  );
};