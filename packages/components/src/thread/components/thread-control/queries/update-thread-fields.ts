'use server';

import 'server-only';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { validateThreadOwner } from '#thread/components/thread-control/queries/validate-thread-owner.ts';
import {
  ThreadControlQueryValues,
} from '#thread/components/thread-control/queries/thread-control-query.ts';

type UpdateThread = {
  threadId: string,
  values: ThreadControlQueryValues
}

export async function updateThread({
  threadId, values
}: UpdateThread) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const isValid = await validateThreadOwner({
    threadId, currentUserNickname: currentUser.nickname
  });
  
  if (!isValid) return;
  
  const api = createClient();
  
  const { error } = await api
  .from('threads')
  .update(values)
  .eq('id', threadId)
  
  return !error;
}