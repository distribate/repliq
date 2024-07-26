'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadControl } from '../hooks/use-thread-control.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { RequestOptionsSupabaseClient } from '@repo/types/config/request-types.ts';
import { ThreadRequest } from '../../../types/thread-request-types.ts';

type UpdateThreadFields = ThreadControl & Partial<{
  field: {
    [key: string]: string | boolean | null;
  };
}>

type UpdateThreadRequestType = RequestOptionsSupabaseClient & ThreadRequest

async function getThreadCreatorNickname({
  thread_id, supabase
}: UpdateThreadRequestType) {
  const { data, error } = await supabase
  .from('threads_users')
  .select('user_nickname')
  .eq('thread_id', thread_id)
  .single();
  if (error) throw new Error(error.message)
  
  return data;
}

async function threadRemove({
  thread_id, supabase
}: UpdateThreadRequestType) {
  const { error: threadRemoveErr } = await supabase
  .from('threads')
  .delete()
  .eq('id', thread_id);
  
  if (threadRemoveErr) console.log(threadRemoveErr.message);
}

async function threadImagesRemove({
  thread_id, supabase
}: UpdateThreadRequestType) {
  const { data: existingThreadImages, error: existingThreadImagesErr } = await supabase
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id)
  .single();
  
  if (existingThreadImagesErr) throw new Error(existingThreadImagesErr.message);
  
  const { error: removeImagesFromStorage } = await supabase
  .storage
  .from('threads')
  .remove(existingThreadImages.images);
  
  if (removeImagesFromStorage) throw new Error(removeImagesFromStorage.message);
  
  const { error: removeImagesFromTable } = await supabase
  .from('threads_images')
  .delete()
  .eq('thread_id', thread_id);
  
  if (removeImagesFromTable) {
    console.error(removeImagesFromTable.message)
    throw new Error(removeImagesFromTable.message)
  }
}

export async function updateThreadFields({
  id: thread_id, type, field,
}: UpdateThreadFields) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  const threadCreator = await getThreadCreatorNickname({
    thread_id, supabase
  })
  
  if (!threadCreator || threadCreator.user_nickname !== currentUser.nickname) return;
  
  if (type === 'remove') {
    await Promise.all([
      threadRemove({
        thread_id, supabase
      }),
      threadImagesRemove({
        thread_id, supabase
      })
    ])

    return true;
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
    console.log(error.message);
  }
  
  return data;
}