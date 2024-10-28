'use server';

import { Tables } from '@repo/types/entities/supabase.ts';
import { UpdateThreadRatingType } from './post-thread-rating.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

type ThreadRatingTable = Tables<'threads_rating'>;

export type ThreadRatingResponse = {
  increment: number,
  decrement: number,
  currentType: UpdateThreadRatingType
}

type ThreadRating = Pick<ThreadRequest, 'thread_id'>["thread_id"]

export async function getThreadRating(
  threadId: ThreadRating
): Promise<ThreadRatingResponse | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const api = createClient();
  
  const [ currentType, rating ] = await Promise.all([
    api
    .from('threads_rating')
    .select('type')
    .eq('thread_id', threadId)
    .eq('user_id', currentUser?.id)
    .single(),
    api
    .from('threads_rating')
    .select('*')
    .eq('thread_id', threadId)
    .returns<ThreadRatingTable[]>(),
  ]);
  
  const { data: current } = currentType;
  const { data, error } = rating;
  
  if (error) return null;
  
  return {
    increment: data.filter(item => item.type === 'increment').length || 0,
    decrement: data.filter(item => item.type === 'decrement').length || 0,
    currentType: current?.type as UpdateThreadRatingType,
  };
}