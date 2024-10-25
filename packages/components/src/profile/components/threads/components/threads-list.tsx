"use client"

import Link from 'next/link';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ArrowUp, ArrowUpRight, LayoutGrid, MessageSquare, MessageSquareOff, Search } from 'lucide-react';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import dayjs from 'dayjs';
import { threadsQuery } from '../queries/threads-query.ts';
import { ThreadsSkeleton } from './threads-skeleton.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { ContentNotFound } from '../../../../templates/section-not-found.tsx';
import { FilteringSearch } from '../../../../filtering/components/filtering-search.tsx';
import React, { ChangeEvent, forwardRef, useCallback, useState } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { Input } from '@repo/ui/src/components/input.tsx';
import { DropdownWrapper } from '../../../../wrappers/dropdown-wrapper.tsx';
import { SelectedWrapper } from '../../../../wrappers/selected-wrapper.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { VIEW_COMPONENTS_TYPE } from '../../../../friends/components/filtering/components/friends-filtering-view.tsx';

const ThreadsFiltering = forwardRef<
  HTMLInputElement
>((props, ref) => {
  const [ value, setValue ] = useState('');
  
  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
  
  }, 100), []);
  
  const handleSearchInput = (e: ChangeEvent<
    HTMLInputElement
  >) => {
    const { value } = e.target;
    
    setValue(value);
    debouncedHandleSearch(value);
  };
  
  return (
    <Input
      ref={ref}
      className="rounded-lg"
      value={value}
      placeholder="Поиск по названию"
      onChange={handleSearchInput}
      {...props}
    />
  );
})

export const ThreadsList = ({
  nickname
}: Pick<UserEntity, "nickname">) => {
  const { data: userTopics, isLoading } = threadsQuery(nickname);
  
  if (isLoading) return <ThreadsSkeleton />;
  
  if (!userTopics
    || userTopics && !userTopics.length
  ) return <ContentNotFound title="Треды не найдены."/>;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" className="text-lg font-semibold">
            Треды
          </Typography>
          <Typography textSize="medium" className="text-shark-300">
            (всего {userTopics?.length})
          </Typography>
        </div>
        <div className="flex items-center gap-4 w-fit">
          <FilteringSearch>
            <ThreadsFiltering/>
          </FilteringSearch>
          <div className="w-fit">
            <DropdownWrapper
              properties={{
                sideAlign: 'bottom', contentAlign: 'end', contentClassname: 'w-[200px]',
              }}
              trigger={
                <SelectedWrapper>
                  <LayoutGrid size={20} className="text-shark-300" />
                </SelectedWrapper>
              }
              content={
                <div className="flex flex-col gap-y-2">
                  <Typography textSize="small" className="text-shark-300 px-2 pt-2">
                    Вид
                  </Typography>
                  <div className="flex flex-col gap-y-2">
                    {VIEW_COMPONENTS_TYPE.map(view => (
                      <DropdownMenuItem
                        key={view.name}
                        // onClick={() => handleView(view.name)}
                        className="items-center gap-1"
                      >
                        <view.icon size={16} className="text-shark-300" />
                        <Typography
                          // className={isViewType(view.name) ? 'text-caribbean-green-500' : ''}
                        >
                          {view.title}
                        </Typography>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
          <Typography textSize="small" className="text-shark-300">
            Order
          </Typography>
        </div>
      </div>
      {userTopics?.map((topic, i) => (
        <div
          key={i}
          className="flex items-center py-2 px-2 bg-shark-950 border border-shark-800 rounded-lg transition-all ease-in hover:duration-150 justify-between"
        >
          <div className="flex flex-col gap-y-1 w-full">
            <div className="w-1/2">
              <Link href={THREAD_URL + topic.id}>
                <Typography textColor="shark_white" className="text-md font-normal truncate">
                  {topic.title}
                </Typography>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {topic.comments ? (
                <div className="flex items-center gap-1">
                  <Typography className="text-sm text-shark-50">0</Typography>
                  <MessageSquare size={16} className="text-shark-300 font-normal text-sm" />
                </div>
              ) : <MessageSquareOff size={16} className="text-red-300 text-sm font-normal" />}
              <Separator orientation="vertical" />
              <div className="flex items-center gap-1">
                <Typography className="text-sm text-shark-50">0</Typography>
                <ArrowUp size={16} className="text-shark-300 font-normal text-sm" />
              </div>
              <Separator orientation="vertical" />
              <Typography className="text-shark-300 text-sm font-normal">
                {dayjs(topic.created_at).format('DD.MM.YY HH:mm')}
              </Typography>
            </div>
          </div>
          <Link href={THREAD_URL + topic.id}>
            <ArrowUpRight
              size={24}
              className="hover:text-pink-300 text-shark-300 hover:rotate-45 transition-all ease-in duration-150"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};