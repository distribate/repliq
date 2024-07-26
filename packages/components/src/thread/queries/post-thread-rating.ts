'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';
import { RequestOptionsSupabaseClient } from '@repo/types/config/request-types.ts';

export type UpdateThreadRatingType = 'increment' | 'decrement'

export type UpdateThreadRating = {
  type: UpdateThreadRatingType,
  threadId: Pick<ThreadRequest, 'thread_id'>['thread_id']
}

type UpdateThreadRatingError = 'alreadyRating' | 'default'

type RatingType = RequestOptionsSupabaseClient & {
  threadId: string,
  currentUserId: string
}

type PostRating = RatingType & UpdateThreadRating

async function deleteDecrementRating({
  currentUserId, threadId, supabase
}: RatingType) {
  const { error } = await supabase
  .from('threads_rating')
  .delete()
  .eq('thread_id', threadId)
  .eq("user_id", currentUserId)
  .eq('type', 'decrement');
  if (error) throw new Error(error.message)
}

async function deleteIncrementRating({
  supabase, currentUserId, threadId
}: RatingType) {
  const { error } = await supabase
  .from('threads_rating')
  .delete()
  .eq('thread_id', threadId)
  .eq("user_id", currentUserId)
  .eq('type', 'increment');
  if (error) throw new Error(error.message)
}

async function postRating({
  currentUserId, threadId, supabase, type
}: PostRating) {
  const { data: threadsRating, error: threadsRatingsErr, statusText } = await supabase
  .from('threads_rating')
  .insert({
    thread_id: threadId,
    user_id: currentUserId,
    type: type,
  })
  .select()
  .single();
  
  if (threadsRatingsErr || statusText === 'Conflict') {
    const { error: threadsRatingsErr } = await supabase
    .from('threads_rating')
    .delete()
    .eq('thread_id', threadId)
    .eq("user_id", currentUserId)
    .eq('type', type);
    
    if (threadsRatingsErr) return 'default'
    
    return true;
  }
  
  return threadsRating && !threadsRatingsErr;
}

export async function updateThreadRating({
  type, threadId,
}: UpdateThreadRating): Promise<boolean | UpdateThreadRatingError> {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser || !threadId) return 'default';
  
  switch(type) {
    case 'increment':
      await deleteDecrementRating({
        currentUserId: currentUser.id, threadId: threadId, supabase
      })
      break;
    case 'decrement':
      await deleteIncrementRating({
        threadId: threadId, currentUserId: currentUser.id, supabase
      })
      break;
  }
  
  return await postRating({
    type, supabase, currentUserId: currentUser.id, threadId: threadId
  })
}