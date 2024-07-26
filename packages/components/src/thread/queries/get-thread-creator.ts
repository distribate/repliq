"use server"

import { USER } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';

export async function getThreadCreator(
  threadId: Pick<ThreadRequest, 'thread_id'>["thread_id"]
): Promise<Pick<USER, 'name_color' | 'nickname'> | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('threads_users')
  .select('*, users(nickname)')
  .eq('thread_id', threadId);
  
  if (error) return null;
  
  return data.map(item => item.users)[0];
}