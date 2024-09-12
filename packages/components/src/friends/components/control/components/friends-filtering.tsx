'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FriendsFilteringView } from '../../filtering/components/friends-filtering-view.tsx';
import { FriendsSort } from '../../../../profile/components/friends/components/friends-sort.tsx';
import { FilteringSearch } from '../../../../filtering/components/filtering-search.tsx';
import { FriendsSearch } from '../../../../profile/components/friends/components/friends-search.tsx';

export const FriendsFiltering = () => {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="sectionTitle">
        Друзья
      </Typography>
      <div className="flex items-center gap-4">
        <FilteringSearch>
          <FriendsSearch/>
        </FilteringSearch>
        <FriendsFilteringView />
        <FriendsSort />
      </div>
    </div>
  );
};