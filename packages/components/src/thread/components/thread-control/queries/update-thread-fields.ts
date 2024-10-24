'use server';

import 'server-only';
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { UpdateThreadFields, UpdateThreadRequestType } from '../types/update-thread-request-types.ts';
import { removeThread } from './remove-thread.ts';

async function getThreadCreatorNickname({
  thread_id, supabase,
}: UpdateThreadRequestType) {
  const { data, error } = await supabase
  .from('threads_users')
  .select('user_nickname')
  .eq('thread_id', thread_id)
  .single();
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateThreadFields({
  id: thread_id, type, field,
}: UpdateThreadFields) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser || !thread_id) return;
  
  const threadCreator = await getThreadCreatorNickname({
    thread_id, supabase
  });
  
  if (!threadCreator
    || threadCreator.user_nickname !== currentUser.nickname
  ) return;
  
  if (type === 'remove') {
    return await removeThread({ thread_id, supabase });
  }
  
  if (!field) return;
  
  const fields = Object.keys(field).join(',');

  const updateFields = Object
  .entries(field)
  .reduce((acc, [ key, value ]) => {
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string | null | boolean });
  
  const { data, error } = await supabase
  .from('threads')
  .update(updateFields)
  .eq('id', thread_id)
  .select(fields);
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  return data;
}