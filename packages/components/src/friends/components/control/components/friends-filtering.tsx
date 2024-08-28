'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FriendsFilteringView } from '../../filtering/components/friends-filtering-view.tsx';
import { FriendsFilteringSearch } from '../../filtering/components/friends-filtering-search.tsx';
import { FriendsSort } from '../../../../profile/components/friends/components/friends-sort.tsx';

export const FriendsFiltering = () => {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="sectionTitle">
        Друзья
      </Typography>
      <div className="flex items-center gap-4">
        <FriendsFilteringSearch />
        <FriendsFilteringView />
        <FriendsSort />
      </div>
    </div>
  );
};