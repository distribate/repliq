'use server';

import 'server-only';
import { ThreadEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import { getThreadRating, ThreadRatingResponse } from './get-thread-rating.ts';
import { getThreadCreator } from './get-thread-creator.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';
import { getThreadCommentsCount } from './get-thread-comments-count.ts';
import { getThread } from './get-thread.ts';
import { getThreadImagesCount } from './get-thread-images-count.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type ThreadModelDetails = {
  commentsCount: number,
  rating: ThreadRatingResponse | null,
  images: boolean
  owner: Pick<UserEntity, 'nickname' | "name_color">
  tags: Array<string> | null
  views: number | null
}

export type ThreadModel = ThreadEntity & ThreadModelDetails

type GetThreadModel = {
  withViews: boolean
  threadId: Pick<ThreadRequest, 'thread_id'>['thread_id']
}

async function getThreadTags(threadId: string): Promise<null | string[]> {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_tags')
  .select('tags')
  .eq('thread_id', threadId)
  .single();
  
  if (error) return null;
  
  return data.tags as string[];
}

async function postThreadView(threadId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  await api
  .from('threads_views')
  .insert({ user_id: currentUser.id, thread_id: threadId });
}

async function getThreadViews(threadId: string): Promise<number> {
  const api = createClient();
  
  const { count, error } = await api
  .from('threads_views')
  .select('*', { count: 'exact' })
  .eq('thread_id', threadId);
  
  if (error) return 0;
  
  return count ? count : 0;
}

export async function getThreadModel({
  threadId, withViews
}: GetThreadModel): Promise<ThreadModel | null> {
  let images: boolean = false; // if existing images of thread
  let views: number | null = null;
  
  if (!threadId) return null;
  
  const [ thread, threadImagesCount, threadCreator, commentsCount, tags, rating ] = await Promise.all([
    getThread(threadId),
    getThreadImagesCount(threadId),
    getThreadCreator(threadId),
    getThreadCommentsCount(threadId),
    getThreadTags(threadId),
    getThreadRating(threadId),
  ]);
  
  if (!thread || !threadCreator) return null;
  
  if (threadImagesCount && threadImagesCount >= 1) {
    images = true
  }
  
  if (withViews) {
    await postThreadView(threadId);
    views = await getThreadViews(threadId);
  }

  return {
    ...thread,
    owner: threadCreator,
    commentsCount, tags, views, images, rating
  }
}