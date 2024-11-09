'use server';

import 'server-only';
import { ThreadEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import { getThreadRating, ThreadRatingResponse } from './get-thread-rating.ts';
import { getThreadCreator } from './get-thread-creator.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type ThreadModelDetails = {
  commentsCount: number,
  rating: ThreadRatingResponse | null,
  owner: Pick<UserEntity, 'nickname' | 'name_color'>
  tags: Array<string> | null
  views: number | null
}

export type ThreadModel = ThreadEntity & ThreadModelDetails

type GetThreadModel = {
  withViews: boolean
  threadId: Pick<ThreadEntity, 'id'>['id']
}

async function postThreadView(threadId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  await api.from('threads_views').insert({
    user_id: currentUser.id, thread_id: threadId,
  });
}

type Thread = ThreadEntity & {
  threads_tags: Array<{ tags: string[] }>
  threads_views: Array<{ count: number }>,
  threads_comments: Array<{ count: number }>
}

async function getThread(
  threadId: Pick<ThreadEntity, 'id'>['id'],
): Promise<Thread | null> {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .select(`
    *,
    threads_tags(tags),
    threads_views(count),
    threads_comments(count)
  `)
  .eq('id', threadId)
  .single();
  
  if (error) return null;
  
  return {
    ...data,
    threads_tags: data.threads_tags ?? [],
    threads_views: data.threads_views ?? [{ count: 0 }],
    threads_comments: data.threads_comments ?? [{ count: 0 }],
  };
}

export async function getThreadModel({
  threadId, withViews,
}: GetThreadModel): Promise<ThreadModel | null> {
  const [ thread, threadCreator, rating ] = await Promise.all([
    getThread(threadId),
    getThreadCreator(threadId),
    getThreadRating(threadId),
  ]);
  
  if (!thread || !threadCreator) return null;
  
  if (withViews) {
    await postThreadView(threadId);
  }
  
  return {
    ...thread,
    rating,
    owner: threadCreator,
    tags: thread.threads_tags[0]?.tags || null,
    views: thread.threads_views[0]?.count || 0,
    commentsCount: thread.threads_comments[0]?.count || 0,
  };
}