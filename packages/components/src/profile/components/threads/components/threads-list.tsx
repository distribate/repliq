'use client';

import Link from 'next/link';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ArrowUp, LayoutGrid, MessageSquare, MessageSquareOff } from 'lucide-react';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { threadsQuery } from '../queries/threads-query.ts';
import { ThreadsSkeleton } from './threads-skeleton.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { FilteringSearch } from '#filtering/components/filtering-search.tsx';
import { ChangeEvent, forwardRef, useState } from 'react';
import { Input } from '@repo/ui/src/components/input.tsx';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { SelectedWrapper } from '#wrappers/selected-wrapper.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { VIEW_COMPONENTS_TYPE } from '#friends/components/filtering/contants/view-components-type.ts';
import { UserThreads } from '#profile/components/threads/queries/get-threads-user.ts';
import { Button } from '@repo/ui/src/components/button.tsx';

const ThreadsFiltering = forwardRef<
  HTMLInputElement
>((props, ref) => {
  const [ value, setValue ] = useState<string>('');
  
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
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
});

const ProfileThreadsListCard = ({
  created_at, id, title, comments, commentsCount, rating
}: UserThreads) => {
  return (
    <div
      className="flex items-center bg-shark-950 px-4 py-2 rounded-lg justify-between"
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-1 w-full">
            <div className="w-fit">
              <Typography
                textColor="shark_white"
                textSize="large"
                className="font-semibold truncate"
              >
                {title}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={THREAD_URL + id} className="w-fit">
              <Button state="default" className="px-4">
                <Typography>Перейти к треду</Typography>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4 w-full">
            {comments ? (
              <div className="flex items-center gap-1">
                <Typography textSize="medium" textColor="shark_white">
                  {commentsCount}
                </Typography>
                <MessageSquare size={20} className="text-shark-300 font-normal" />
              </div>
            ) : <MessageSquareOff size={20} className="text-red-500 font-normal" />}
            <Separator orientation="vertical" />
            <div className="flex items-center gap-1">
              <Typography textSize="medium" textColor="shark_white">
                {rating}
              </Typography>
              <ArrowUp size={20} className="text-shark-300 font-normal text-sm" />
            </div>
          </div>
          <Typography
            title={dayjs(created_at).format('LL')}
            textSize="medium"
            textColor="gray"
            className="cursor-default"
          >
            {dayjs(created_at).fromNow()}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export const ThreadsList = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  const { data: threads, isLoading } = threadsQuery({ nickname, ascending: true });
  
  if (isLoading) return <ThreadsSkeleton />;
  
  if (!threads
    || threads && !threads.length
  ) return <ContentNotFound title="Треды не найдены." />;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" className="text-lg font-semibold">
            Треды
          </Typography>
          <Typography textSize="medium" className="text-shark-300">
            [всего {threads.length}]
          </Typography>
        </div>
        <div className="flex items-center gap-4 w-fit">
          <FilteringSearch>
            <ThreadsFiltering />
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
        </div>
      </div>
      {threads.map(thread => (
        <ProfileThreadsListCard key={thread.id} {...thread} />
      ))}
    </div>
  );
};