'use client';

import Link from 'next/link';
import { useHistoryThreads } from '../saved-thread/hooks/use-history-threads.tsx';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { ReactNode } from 'react';
import { ThreadModel } from '../../queries/get-thread-model.ts';

type ThreadLayout = {
  children: ReactNode,
} & Pick<ThreadModel, 'id' | 'nickname' | 'title'>

export const ThreadLayout = ({
  children, title, nickname, id: threadId
}: ThreadLayout) => {
  const { saveThread } = useHistoryThreads();
  
  return (
    <Link
      href={THREAD_URL + threadId}
      onClick={() => saveThread({
        title, nickname, threadId
      })}
    >
      {children}
    </Link>
  );
};