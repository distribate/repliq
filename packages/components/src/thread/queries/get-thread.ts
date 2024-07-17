import { THREAD } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import dayjs from 'dayjs';
import { getThreadRating, ThreadRatingResponse } from './get-thread-rating.ts';

type ThreadRequestType = 'only_thread'
  | 'with_comments'
  | 'all'
  | 'with_images'

type ThreadRequest = Pick<THREAD, 'id'> & Partial<{
  type: ThreadRequestType
}>

export type ThreadModel = THREAD & Partial<{
  nickname: string,
  nicknameColor: string,
  commentsCount: number,
  rating: ThreadRatingResponse,
  images: boolean
}>

export async function getThread({
  id, type = 'only_thread',
}: ThreadRequest) {
  const supabase = createClient();
  
  let thread: ThreadModel | null;
  let nickname: string | null = null;
  let nicknameColor: string | null = null;
  let commentsCount: number | null = null;
  let images: boolean = false;
  let rating: ThreadRatingResponse | null = null;
  
  const { data: onlyThread, error: onlyThreadError } = await supabase
  .from('threads')
  .select('*')
  .eq('id', id);
  
  const { count } = await supabase
  .from("threads_images")
  .select("images", {
    count: "exact"
  })
  .eq("thread_id", id)

  if (count && count >= 1) {
    images = true
  }
  
  if (!onlyThread || onlyThreadError) return;
  
  thread = onlyThread[0];
  
  if (type === 'only_thread' || type === 'all') {
    const { data: threadNickname, error: threadNicknameError } = await supabase
    .from('threads_users')
    .select('*, users(nickname, name_color)')
    .eq('thread_id', id)
    .single();
    
    if (threadNicknameError) return null;
    
    nickname = threadNickname.users.nickname;
    nicknameColor = threadNickname.users.name_color;
  }
  
  if (type === 'with_comments' || type === 'all') {
    const { error: threadCommentsError, count: comments } = await supabase
    .from('threads_comments')
    .select('comment_id', {
      count: 'exact',
    })
    .eq('thread_id', id);
    
    if (threadCommentsError) return null;
    
    commentsCount = comments;
  }
  
  rating = await getThreadRating({
    thread_id: thread?.id,
  });
  
  if (!thread) return null;
  
  const threadModel: ThreadModel = {
    ...thread,
    created_at: dayjs(thread.created_at).format('DD.MM.YYYY HH:mm'),
    ...(nickname && { nickname }),
    ...(nicknameColor && { nicknameColor }),
    ...(commentsCount !== null && { commentsCount }),
    ...(rating !== null && { rating }),
    images
  };
  
  return threadModel;
}