'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useFriendSort } from '#friends/components/filtering/hooks/use-friends-sort.ts';
import {
  friendsFilteringQuery,
  FriendsFilteringQuery,
} from '#friends/components/filtering/queries/friends-filtering-query.ts';
import { ReactNode } from 'react';

type ListType = Pick<FriendsFilteringQuery, 'listType'>['listType']

type FriendsTabProps = {
  children?: ReactNode,
  type: ListType,
  title: string
}

export const FriendsTab = ({
  children, type, title
}: FriendsTabProps) => {
  const { data: friendsFilteringState } = friendsFilteringQuery();
  const { setValueMutation } = useFriendSort();
  
  const handleFriendsListType = () => {
    setValueMutation.mutate({ value: type, type: 'list' });
  };
  
  const isActive = type === friendsFilteringState.listType;
  
  return (
    <div
      onClick={handleFriendsListType}
      className={`${isActive && 'bg-shark-200 text-shark-950'}
        inline-flex justify-start items-center cursor-pointer transition-all rounded-lg p-4 whitespace-nowrap border border-white/10 w-full gap-2 group`}
    >
      <Typography textSize="medium" className="font-medium">
        {title}
      </Typography>
      {children && children}
    </div>
  )
}