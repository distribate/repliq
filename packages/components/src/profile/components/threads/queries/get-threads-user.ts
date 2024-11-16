'use server';

import 'server-only';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadCommentEntity, ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { getThreadRating } from '#thread/queries/get-thread-rating.ts';

export type GetThreadsUser = {
  nickname: string
  ascending?: boolean,
  order?: 'created_at' | 'views' | 'rating'
}

export type UserThreads = Pick<ThreadEntity, 'id' | 'title' | 'isComments' | 'created_at'> & {
  commentsCount: number,
  rating: number
}

export async function getThreadsUser({
  ascending = false, nickname, order = 'created_at',
}: GetThreadsUser): Promise<UserThreads[]> {
  const api = createClient();
  
  let query = api
  .from('threads_users')
  .select(`thread_id, threads(id,title,isComments,created_at)`)
  .eq('user_nickname', nickname);
  
  query.order(order, {
    referencedTable: 'threads', ascending,
  });
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  const flatMappedThreads = data.flatMap(item => item.threads);
  const threadIds = flatMappedThreads.map(thread => thread.id);
  
  const commentsCounts = await api
  .from('threads_comments')
  .select('*', { count: 'exact' })
  .in('thread_id', threadIds)
  .returns<ThreadCommentEntity[]>();
  
  if (commentsCounts.error) {
    throw new Error(commentsCounts.error.message);
  }
  
  const commentsCountMap = commentsCounts.data?.reduce((
    map,
    comment,
  ) => {
    map[comment.thread_id] = (map[comment.thread_id] || 0) + 1;
    return map;
  }, {} as Record<string, number>);
  
  return await Promise.all(
    flatMappedThreads.map(async thread => {
      let sumRating: number = 0;
      const commentsCount = commentsCountMap?.[thread.id] ?? 0;
      const rating = await getThreadRating(thread.id);
      
      if (rating) {
        const { increment, decrement } = rating;
        
        if (increment > 0) {
          sumRating = increment
        } else sumRating = increment - decrement;
      }
      
      return {
        ...thread,
        commentsCount,
        rating: sumRating,
      };
    }),
  );
}