'use client';

import { friendsSortQuery } from '../hooks/use-friends-sort.tsx';
import { SomethingError } from '#templates/something-error.tsx';
import { FilteredNotFound } from '#templates/filtered-not-found.tsx';
import { RequestFriends } from '#friends/queries/get-friends.ts';
import { friendsQuery } from '#friends/queries/friends-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendProfileCard } from '#friend/components/friend-card/components/friend-profile-card.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

type FriendsSearch = Pick<UserEntity, "nickname" | "name_color">

const filterFriendsByNickname =
  (data: FriendsSearch[], query: string) => data.filter(
  item => item.nickname.startsWith(query)
);

const FriendProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Skeleton className="w-[46px] h-[46px]"/>
        <div className="flex flex-col">
          <Skeleton className="w-[89px] h-[46px]"/>
          <Skeleton className="w-[68px] h-[46px]"/>
        </div>
      </div>
      <div className="flex flex-col">
        <Skeleton className="w-[126px] h-[46px]"/>
        <Skeleton className="w-[45px] h-[46px]"/>
      </div>
    </div>
  )
}

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