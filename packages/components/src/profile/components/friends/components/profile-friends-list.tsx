'use client';

import { friendsSortQuery } from '../hooks/use-friends-sort.tsx';
import { FilteredNotFound } from '#templates/filtered-not-found.tsx';
import { RequestFriends, UserFriends } from '#friends/queries/get-friends.ts';
import { FRIENDS_QUERY_KEY, friendsQuery } from '#friends/queries/friends-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendProfileCard } from '#friend/components/friend-card/components/friend-profile-card.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dynamic from 'next/dynamic';

const SomethingError = dynamic(() =>
  import("#templates/something-error.tsx")
  .then(m => m.SomethingError)
)

type FriendsSearch = Pick<UserEntity, 'nickname' | 'name_color'>

type FriendsListLayout = {
  friends: UserFriends[]
}

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

const ProfileFriendsList = ({
  friends: friendsData,
}: FriendsListLayout) => {
  const { data: friendsSortState } = friendsSortQuery();
  
  const friends = friendsSortState.search ? filterFriendsByNickname(
    friendsData, friendsSortState.search,
  ) : friendsData;
  
  if (friends && !friends.length) {
    return <FilteredNotFound value={friendsSortState.search} />;
  }
  
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      {friends.map((friend, i) =>
        <FriendProfileCard key={i} nickname={friend.nickname} name_color={friend.name_color} />
      )}
    </div>
  );
};

export const ProfileFriends = ({
  nickname,
}: RequestFriends) => {
  const qc = useQueryClient();
  const currentFriends = qc.getQueryData<UserFriends[]>(FRIENDS_QUERY_KEY(nickname));
  
  const { data: fetchedFriends, isLoading, isError } = friendsQuery({ nickname, enabled: !currentFriends });
  
  if (isError) return <SomethingError />;
  
  const friendsData = currentFriends || fetchedFriends;
  const notFound = !currentFriends
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {(!notFound && !isLoading) && (
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" className="text-lg font-semibold">
            Друзья
          </Typography>
        </div>
      )}
      {isLoading && <FriendsListSkeleton />}
      {friendsData ? (
        <ProfileFriendsList friends={friendsData} />
      ) : (
        <ContentNotFound title="Друзей нет" />
      )}
    </div>
  );
};