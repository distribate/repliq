import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';

type ThreadRatingUserUserList = Pick<ThreadRequest, "thread_id">

export async function getThreadRatingUserList({
  thread_id
}: ThreadRatingUserUserList) {
  const supabase = createClient()
  
  const {
    data: userListByRating,
    error: userListByRatingError
  } = await supabase
  .from("threads_rating")
  .select("id, user_id, users(nickname, id)")
  .eq("thread_id", thread_id)
  
  if (userListByRatingError) return null;
  
  return userListByRating.flatMap(item => item.users)
}