'use server';

import 'server-only';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { UpdateThreadFields } from '../types/update-thread-request-types.ts';
import { removeThread } from './remove-thread.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

async function getThreadCreatorNickname(threadId: Pick<ThreadEntity, 'id'>["id"]) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_users')
  .select('user_nickname')
  .eq('thread_id', threadId)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateThreadFields({
  id: threadId, type, field,
}: UpdateThreadFields) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const threadCreator = await getThreadCreatorNickname(threadId);
  
  if (!threadCreator
    || threadCreator.user_nickname !== currentUser.nickname
  ) return;
  
  if (type === 'remove') {
    return removeThread({ id: threadId });
  }
  
  if (!field) return;
  
  const fields = Object.keys(field).join(',');

  const updateFields = Object
  .entries(field)
  .reduce((acc, [ key, value ]) => {
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string | null | boolean });
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .update(updateFields)
  .eq('id', threadId)
  .select(fields);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}