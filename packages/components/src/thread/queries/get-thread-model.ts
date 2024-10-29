'use server';

import 'server-only';
import { ThreadEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import { getThreadRating, ThreadRatingResponse } from './get-thread-rating.ts';
import { getThreadCreator } from './get-thread-creator.ts';
import { ThreadRequest, ThreadRequestType } from '../types/thread-request-types.ts';
import { getThreadCommentsCount } from './get-thread-comments-count.ts';
import { getThread } from './get-thread.ts';
import { getThreadImagesCount } from './get-thread-images-count.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

type ThreadModelDetails = {
  commentsCount: number,
  rating: ThreadRatingResponse | null,
  images: boolean
  threadTags: Array<string> | null
}

export type ThreadModel = ThreadEntity
  & Pick<UserEntity, 'nickname'> & ThreadModelDetails

type GetThreadModel = {
  type: ThreadRequestType
} & {
  threadId: Pick<ThreadRequest, 'thread_id'>['thread_id']
}

async function getThreadTags(threadId: string) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_tags')
  .select('tags')
  .eq('thread_id', threadId)
  .single();
  
  if (error) {
    return null;
  }
  
  return data.tags;
}

export async function getThreadModel({
  threadId, type = 'only_thread',
}: GetThreadModel): Promise<ThreadModel | null> {
  let thread: ThreadModel | null;
  let nickname: string = '';
  let commentsCount: number = 0;
  let images: boolean = false; // if existing images of thread
  let rating: ThreadRatingResponse | null = null;
  
  if (!threadId) return null;
  
  const [ threadItem, threadImagesCount, threadCreator, threadCommentsCount ] = await Promise.all([
    getThread(threadId),
    getThreadImagesCount(threadId),
    getThreadCreator(threadId),
    getThreadCommentsCount(threadId),
  ]);
  
  if (threadImagesCount && threadImagesCount >= 1) {
    images = true;
  }
  
  const threadTags = await getThreadTags(threadId);
  
  if (!threadItem || !threadCreator) return null;
  
  thread = threadItem[0];
  nickname = threadCreator.nickname;
  commentsCount = threadCommentsCount || 0;
  
  if (!thread) return null;
  
  rating = await getThreadRating(threadId);
  
  return {
    ...thread, nickname, threadTags, commentsCount, images, rating,
  };
}