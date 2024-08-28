"use client"

import Link from 'next/link';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ArrowUp, ArrowUpRight, LayoutGrid, MessageSquare, MessageSquareOff, Search } from 'lucide-react';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import dayjs from 'dayjs';
import { threadsQuery } from '../queries/threads-query.ts';
import { ThreadsSkeleton } from './threads-skeleton.tsx';
import { USER } from '@repo/types/entities/entities-type.ts';
import { ContentNotFound } from '../../../../templates/section-not-found.tsx';

export const ThreadsList = ({
  nickname
}: Pick<USER, "nickname">) => {
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
          <Search size={20} className="text-shark-300" />
          <LayoutGrid size={20} className="text-shark-300" />
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