"use server"

import "server-only"
import { UpdateThreadRequestType } from '../types/update-thread-request-types.ts';

async function threadRemove({
  thread_id, supabase,
}: UpdateThreadRequestType): Promise<boolean> {
  const { error: threadRemoveErr } = await supabase
  .from('threads')
  .delete()
  .eq('id', thread_id);
  
  if (threadRemoveErr) {
    console.error(threadRemoveErr.message)
    throw new Error(threadRemoveErr.message);
  }
  
  return !threadRemoveErr;
}

async function threadImagesRemove({
  thread_id, supabase,
}: UpdateThreadRequestType) {
  const { data: existingThreadImages, status, error: existingThreadImagesErr } = await supabase
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id)
  .single();
  
  if (existingThreadImagesErr && status !== 406) {
    console.error(existingThreadImagesErr.message)
    throw new Error(existingThreadImagesErr.message);
  }
  
  if (!existingThreadImages) {
    return
  }
  
  const { error: removeImagesFromStorage } = await supabase
  .storage
  .from('threads')
  .remove(existingThreadImages.images);
  
  if (removeImagesFromStorage) {
    console.error(removeImagesFromStorage.message)
    throw new Error(removeImagesFromStorage.message);
  }
  
  const { error: removeImagesFromTable } = await supabase
  .from('threads_images')
  .delete()
  .eq('thread_id', thread_id);
  
  if (removeImagesFromTable) {
    console.error(removeImagesFromTable.message)
    throw new Error(removeImagesFromTable.message);
  }
}

export async function removeThread({
  thread_id, supabase
}: UpdateThreadRequestType) {
  await threadImagesRemove({ thread_id, supabase });
  await threadRemove({ thread_id, supabase });
  
  return true;
}