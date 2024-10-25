"use server"

import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type GetThreadCreator = Pick<UserEntity, 'name_color' | 'nickname'> | null

export async function getThreadCreator(
  threadId: Pick<ThreadRequest, 'thread_id'>["thread_id"]
): Promise<GetThreadCreator> {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_users')
  .select('*, users(nickname)')
  .eq('thread_id', threadId);
  
  if (error) return null;
  
  return data.map(item => item.users)[0];
}