'use client';

import { FriendProfileCard } from '#friend/components/friend-card/friend-profile-card.tsx';
import { friendsSortQuery } from '../hooks/use-friends-sort.tsx';
import { SomethingError } from '#templates/something-error.tsx';
import { FriendProfileCardSkeleton } from '#friend/components/friend-card/friend-profile-card-skeleton.tsx';
import { FilteredNotFound } from '#templates/filtered-not-found.tsx';
import { RequestFriends } from '#friends/queries/get-friends.ts';
import { friendsQuery } from '#friends/queries/friends-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';

type FriendsSearch = {
  nickname: string
}

const filterFriendsByNickname =
  (data: FriendsSearch[], query: string) => data.filter(
  item => item.nickname.startsWith(query)
);

export const FriendsList = ({
  nickname
}: RequestFriends) => {
  const { data: friendsSortState } = friendsSortQuery();
  const { data: friendsData, isLoading, isError } = friendsQuery({ nickname });
  
  if (isError) return <SomethingError />;
  
  if (!friendsData) {
    return <ContentNotFound title="Друзей пока нет." />;
  }
  
  const friends = friendsSortState.search ? filterFriendsByNickname(
    friendsData, friendsSortState.search,
  ) : friendsData;
  
  if (friends && friends.length === 0) {
    return <FilteredNotFound value={friendsSortState.search} />;
  }
  
  if (!nickname) return;
  
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      {isLoading && Array.from({ length: 3 }).map((_, i) => (
        <FriendProfileCardSkeleton key={i} />
      ))}
      {!isLoading && (
        friends?.map((friend, i) => (
          <FriendProfileCard key={i} nickname={friend.nickname} />
        ))
      )}
    </div>
  );
};