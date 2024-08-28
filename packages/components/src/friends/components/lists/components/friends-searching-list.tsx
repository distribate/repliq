'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { searchingFriends } from '../../../queries/searching-friends-query.ts';
import { ContentNotFound } from '../../../../templates/section-not-found.tsx';
import { FriendsSearchingCard } from '../../searching/components/friends-searching-card.tsx';

export const FriendsSearchingList = () => {
  const { data: searchingUsers } = searchingFriends();
  
  if (!searchingUsers
    || searchingUsers && searchingUsers.length === 0
  ) return <ContentNotFound title="Пока никого не можем вам предложить ;(" />;
  
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <Typography variant="sectionTitle">
        Вы можете их знать
      </Typography>
      <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-2 w-full h-full">
        {searchingUsers.map(user => (
          <FriendsSearchingCard key={user.nickname} {...user} />
        ))}
      </div>
    </div>
  );
};