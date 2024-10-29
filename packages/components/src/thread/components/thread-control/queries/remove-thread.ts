"use server"

import "server-only"
import { UpdateThreadRequestType } from '../types/update-thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

async function threadRemove({
  thread_id
}: UpdateThreadRequestType): Promise<boolean> {
  const api = createClient();
  
  const { error: threadRemoveErr } = await api
  .from('threads')
  .delete()
  .eq('id', thread_id);
  
  if (threadRemoveErr) {
    throw new Error(threadRemoveErr.message);
  }
  
  return !threadRemoveErr;
}

async function threadImagesRemove({
  thread_id
}: UpdateThreadRequestType) {
  const api = createClient();
  
  const { data: existingThreadImages, status, error: existingThreadImagesErr } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id)
  .single();
  
  if (existingThreadImagesErr && status !== 406) {
    throw new Error(existingThreadImagesErr.message);
  }
  
  if (!existingThreadImages) {
    return
  }
  
  const { error: removeImagesFromStorage } = await api
  .storage
  .from('threads')
  .remove(existingThreadImages.images);
  
  if (removeImagesFromStorage) {
    throw new Error(removeImagesFromStorage.message);
  }
  
  const { error: removeImagesFromTable } = await api
  .from('threads_images')
  .delete()
  .eq('thread_id', thread_id);
  
  if (removeImagesFromTable) {
    throw new Error(removeImagesFromTable.message);
  }
}

export async function removeThread({
  thread_id
}: UpdateThreadRequestType) {
  await threadImagesRemove({ thread_id });
  await threadRemove({ thread_id });
  
  return true;
}