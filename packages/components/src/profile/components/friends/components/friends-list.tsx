'use client';

import { friendsSortQuery } from '../hooks/use-friends-sort.tsx';
import { SomethingError } from '#templates/something-error.tsx';
import { FilteredNotFound } from '#templates/filtered-not-found.tsx';
import { RequestFriends } from '#friends/queries/get-friends.ts';
import { friendsQuery } from '#friends/queries/friends-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendProfileCardSkeleton } from '#friend/components/friend-card/components/friend-profile-card-skeleton.tsx';
import { FriendProfileCard } from '#friend/components/friend-card/components/friend-profile-card.tsx';

type FriendsSearch = Pick<UserEntity, "nickname" | "name_color">

const filterFriendsByNickname =
  (data: FriendsSearch[], query: string) => data.filter(
  item => item.nickname.startsWith(query)
);

export const FriendsList = ({
  nickname
}: RequestFriends) => {
  const { data: friendsSortState } = friendsSortQuery();
  const { data: friendsData, isLoading, isError } = friendsQuery(nickname);
  
  if (isError || !nickname) return <SomethingError />;
  
  if (!friendsData) {
    return <ContentNotFound title="Друзей пока нет." />;
  }
  
  const friends = friendsSortState.search ? filterFriendsByNickname(
    friendsData, friendsSortState.search,
  ) : friendsData;
  
  if (friends && friends.length === 0) {
    return <FilteredNotFound value={friendsSortState.search} />;
  }
  
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      {isLoading && (
        <>
          <FriendProfileCardSkeleton />
          <FriendProfileCardSkeleton />
          <FriendProfileCardSkeleton />
        </>
      )}
      {!isLoading && (
        friends.map((friend, i) => (
          <FriendProfileCard key={i} nickname={friend.nickname} name_color={friend.name_color} />
        ))
      )}
    </div>
  );
};