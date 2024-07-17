'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';

export type UpdateThreadRatingType = 'increment' | 'decrement'

export type UpdateThreadRating = {
  type: UpdateThreadRatingType,
  thread_id: Pick<ThreadRequest, 'thread_id'>['thread_id']
}

type UpdateThreadRatingError = 'alreadyRating' | 'default'

export async function updateThreadRating({
  type, thread_id,
}: UpdateThreadRating): Promise<boolean | UpdateThreadRatingError> {
  const supabase = createClient();
  
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return 'default';
  
  switch(type) {
    case 'increment':
      const { error: decrementDeleteErr } = await supabase
      .from('threads_rating')
      .delete()
      .eq('thread_id', thread_id)
      .eq("user_id", currentUser.id)
      .eq('type', 'decrement');
      
      if (decrementDeleteErr) {
        console.error(decrementDeleteErr.message);
      }
      break;
    case 'decrement':
      const { error: incrementDeleteErr } = await supabase
      .from('threads_rating')
      .delete()
      .eq('thread_id', thread_id)
      .eq("user_id", currentUser.id)
      .eq('type', 'increment');
      
      if (incrementDeleteErr) {
        console.error(incrementDeleteErr.message);
      }
      break;
  }
  
  const { data: threadsRating, error: threadsRatingsErr, status, statusText } = await supabase
  .from('threads_rating')
  .insert({
    thread_id, user_id: currentUser?.id, type: type,
  })
  .select()
  .single();
  
  if (threadsRatingsErr || statusText === 'Conflict') {
    const { error: threadsRatingsErr } = await supabase
    .from('threads_rating')
    .delete()
    .eq('thread_id', thread_id)
    .eq("user_id", currentUser.id)
    .eq('type', type);
    
    if (threadsRatingsErr) return 'default'
    
    return true;
  }
  
  return threadsRating && !threadsRatingsErr;
}