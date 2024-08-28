"use client"

import Link from 'next/link';
import { useSaveLastThread } from '../saved-thread/hooks/use-save-last-thread.tsx';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { ReactNode } from 'react';
import { ThreadModel } from '../../queries/get-thread-model.ts';

type ThreadLayout = {
  children: ReactNode
} & Pick<ThreadModel, "id"
  | "nickname"
  | "title"
>

export const ThreadLayout = ({
  children, title, nickname, id
}: ThreadLayout) => {
  const { saveThread } = useSaveLastThread()
  
  return (
    <Link
      href={THREAD_URL + id}
      onClick={() => saveThread({ title, nickname, id })}
    >
      {children}
    </Link>
  )
}