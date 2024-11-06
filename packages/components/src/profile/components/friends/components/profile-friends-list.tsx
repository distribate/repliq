'use client';

import { friendsSortQuery } from '../hooks/use-friends-sort.tsx';
import { SomethingError } from '#templates/something-error.tsx';
import { FilteredNotFound } from '#templates/filtered-not-found.tsx';
import { RequestFriends, UserFriends } from '#friends/queries/get-friends.ts';
import { FRIENDS_QUERY_KEY, friendsQuery } from '#friends/queries/friends-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendProfileCard } from '#friend/components/friend-card/components/friend-profile-card.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Typography } from '@repo/ui/src/components/typography.tsx';

type FriendsSearch = Pick<UserEntity, 'nickname' | 'name_color'>

const filterFriendsByNickname = (data: FriendsSearch[], query: string) => data
.filter(
  item => item.nickname.startsWith(query),
);

const FriendsListSkeleton = () => {
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      <Skeleton className="w-full h-48" />
      <Skeleton className="w-full h-48" />
      <Skeleton className="w-full h-48" />
      <Skeleton className="w-full h-48" />
      <Skeleton className="w-full h-48" />
    </div>
  );
};

type FriendsListLayout = {
  friends: UserFriends[]
}

const ProfileFriendsList = ({
  friends: friendsData,
}: FriendsListLayout) => {
  const { data: friendsSortState } = friendsSortQuery();
  
  const friends = friendsSortState.search ? filterFriendsByNickname(
    friendsData, friendsSortState.search,
  ) : friendsData;
  
  if (friends && friends.length === 0) {
    return <FilteredNotFound value={friendsSortState.search} />;
  }
  
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      {friends.map((friend, i) => (
        <FriendProfileCard key={i} nickname={friend.nickname} name_color={friend.name_color} />
      ))}
    </div>
  );
};

export const ProfileFriends = ({
  nickname,
}: RequestFriends) => {
  const [ enabled, setEnabled ] = useState(false);
  const qc = useQueryClient();
  const currentFriends = qc.getQueryData<UserFriends[]>(FRIENDS_QUERY_KEY(nickname));
  
  useEffect(() => {
    if (!currentFriends) {
      setEnabled(true);
    }
  }, [ currentFriends ]);
  
  const { data: fetchedFriends, isLoading, isError } = friendsQuery({
    nickname, enabled,
  });
  
  if (isError) return <SomethingError />;
  
  const friendsData = currentFriends || fetchedFriends;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-1 w-fit">
        <Typography textColor="shark_white" className="text-lg font-semibold">
          Друзья
        </Typography>
        <Typography textSize="medium" className="text-shark-300">
          [всего: {friendsData?.length || 0}]
        </Typography>
      </div>
      {(isLoading && !currentFriends) ? (
        <FriendsListSkeleton />
      ) : (
        friendsData ? (
          <ProfileFriendsList friends={friendsData} />
        ) : (
          <ContentNotFound title="Друзей нет" />
        )
      )}
    </div>
  );
};