'use client';

import { RequestFriends } from '../queries/get-friends.ts';
import { FriendCard } from '../../../../friend/components/friend-card/friend-card.tsx';
import { friendsQuery } from '../queries/friends-query.ts';
import { friendsSortQuery } from '../hooks/use-friends-sort.tsx';
import dynamic from 'next/dynamic';
import { SomethingError } from '../../../../templates/something-error.tsx';
import { FriendCardSkeleton } from '../../../../friend/components/friend-card/friend-card-skeleton.tsx';
import { FilteredNotFound } from '../../../../templates/filtered-not-found.tsx';

const FriendsNotFound = dynamic(() =>
  import('../../../../templates/section-not-found.tsx')
  .then(m => m.ContentNotFound),
);

type FriendsSearch = {
  nickname: string
}

const filterFriendsByNickname = (data: FriendsSearch[], query: string) => data.filter(
  item => item.nickname.startsWith(query)
);

export const FriendsList = ({
  nickname
}: RequestFriends) => {
  const { data: friendsSortState } = friendsSortQuery();
  const { data: friendsData, isLoading, isError } = friendsQuery({ nickname });
  
  if (isError) return <SomethingError />;
  
  const friends = friendsSortState.search ? filterFriendsByNickname(
    friendsData, friendsSortState.search,
  ) : friendsData;
 
  if (friendsData && friendsData.length === 0) {
    return <FriendsNotFound title="Друзей пока нет." />;
  }
  
  if (friends && friends.length === 0) {
    return <FilteredNotFound value={friendsSortState.search} />;
  }
  
  if (!nickname) return;
  
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      {isLoading && Array.from([ 0, 3 ]).map((item, i) => <FriendCardSkeleton key={i} />)}
      {!isLoading && (
        friends?.map((friend, i) => (
          <FriendCard
            key={i}
            nickname={friend.nickname}
            reqUserNickname={nickname}
          />
        ))
      )}
    </div>
  );
};