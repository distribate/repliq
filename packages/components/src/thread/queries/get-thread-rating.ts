'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { Tables } from '@repo/types/entities/supabase.ts';
import { UpdateThreadRatingType } from './post-thread-rating.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';

type ThreadRatingTable = Tables<'threads_rating'>;

export type ThreadRatingResponse = {
  increment: number,
  decrement: number
} & Partial<{
  currentType: UpdateThreadRatingType
}>

type ThreadRating = Pick<ThreadRequest, 'thread_id'>

export async function getThreadRating({
  thread_id,
}: ThreadRating): Promise<ThreadRatingResponse | null> {
  const supabase = createClient();
  
  const currentUser = await getCurrentUser();
  
  const [ currentType, rating ] = await Promise.all([
    supabase
    .from('threads_rating')
    .select('type')
    .eq('thread_id', thread_id)
    .eq('user_id', currentUser?.id)
    .single(),
    supabase
    .from('threads_rating')
    .select('*')
    .eq('thread_id', thread_id)
    .returns<ThreadRatingTable[]>(),
  ]);
  
  const { data: current } = currentType;
  const { data, error } = rating;
  
  if (error) return null;
  
  return {
    increment: data?.filter(item => item.type === 'increment').length,
    decrement: data?.filter(item => item.type === 'decrement').length,
    currentType: current?.type as UpdateThreadRatingType,
  };
}