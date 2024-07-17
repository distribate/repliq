'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadControl } from '../hooks/use-thread-control.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type UpdateThreadFields = ThreadControl & Partial<{
  field: {
    [key: string]: string | boolean | null;
  };
}>

export async function updateThreadFields({
  id, type, field,
}: UpdateThreadFields) {
  const supabase = createClient();
  
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  const { data: threadCreator } = await supabase
  .from('threads_users')
  .select('user_nickname')
  .eq('thread_id', id)
  .single();
  
  if (!threadCreator || threadCreator.user_nickname !== currentUser.nickname) return;
  
  if (type === 'remove') {
    const { error: threadRemoveErr } = await supabase
    .from('threads')
    .delete()
    .eq('id', id);
    
    if (threadRemoveErr) console.log(threadRemoveErr.message);
    
    const { data: existingThreadImages, error: existingThreadImagesErr } = await supabase
    .from('threads_images')
    .select('images')
    .eq('thread_id', id)
    .single();
    
    console.log(existingThreadImages);
    
    if (existingThreadImagesErr) throw new Error(existingThreadImagesErr.message);
    
    const { error } = await supabase
    .storage
    .from('threads')
    .remove(existingThreadImages.images);
    
    if (error) throw new Error(error.message);
    
    await supabase
    .from('threads_images')
    .delete()
    .eq('thread_id', id);
    
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
  .eq('id', id)
  .select(fields);
  
  if (error) {
    console.log(error.message);
  }
  
  return data;
}