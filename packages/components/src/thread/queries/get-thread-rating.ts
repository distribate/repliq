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

type ThreadRating = Pick<ThreadRequest, 'thread_id'>['thread_id']

export async function getThreadRating(
  threadId: ThreadRating,
): Promise<ThreadRatingResponse | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const api = createClient();
  
  const { data: currentUserRatingType } = await api
  .from('threads_rating')
  .select('type')
  .eq('thread_id', threadId)
  .eq('user_id', currentUser?.id)
  .single();
  
  const { data: currentRating } = await api
  .from('threads_rating')
  .select('*')
  .eq('thread_id', threadId)
  .returns<ThreadRatingTable[]>();
  
  return {
    increment: currentRating?.filter(item => item.type === 'increment').length || 0,
    decrement: currentRating?.filter(item => item.type === 'decrement').length || 0,
    currentType: currentUserRatingType?.type as UpdateThreadRatingType,
  };
}