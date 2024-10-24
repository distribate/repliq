'use server';

import "server-only"
import { THREAD, USER } from '@repo/types/entities/entities-type.ts';
import { getThreadRating, ThreadRatingResponse } from './get-thread-rating.ts';
import { getThreadImagesCount } from './get-thread-images.ts';
import { getThreadCreator } from './get-thread-creator.ts';
import { ThreadRequest, ThreadRequestType } from '../types/thread-request-types.ts';
import { getThreadCommentsCount } from './get-thread-comments-count.ts';
import { getThread } from './get-thread.ts';

type ThreadModelDetails = {
  commentsCount: number,
  rating: ThreadRatingResponse | null,
  images: boolean
}

export type ThreadModel = THREAD & Pick<USER, 'nickname'> & ThreadModelDetails

type GetThreadModel = {
  type: ThreadRequestType
} & {
  threadId: Pick<ThreadRequest, 'thread_id'>['thread_id']
}

export async function getThreadModel({
  threadId, type = 'only_thread',
}: GetThreadModel): Promise<ThreadModel | null> {
  let thread: ThreadModel | null;
  let nickname: string = '';
  let commentsCount: number = 0;
  let images: boolean = false; // if existing images of thread
  let rating: ThreadRatingResponse | null = null;
  
  const [ threadItem, threadImagesCount, threadCreator, threadCommentsCount ] = await Promise.all([
    getThread(threadId),
    getThreadImagesCount(threadId),
    getThreadCreator(threadId),
    getThreadCommentsCount(threadId),
  ]);
  
  if (threadImagesCount && threadImagesCount >= 1) {
    images = true;
  }
  
  if (!threadItem || !threadCreator) return null;
  
  thread = threadItem[0];
  nickname = threadCreator.nickname;
  commentsCount = threadCommentsCount || 0;
  
  if (!thread) return null;
  
  rating = await getThreadRating(threadId);
  
  return {
    ...thread, nickname, commentsCount, images, rating,
  };
}