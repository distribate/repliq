"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

async function threadRemove({
  id: thread_id
}: Pick<ThreadEntity, 'id'>): Promise<boolean> {
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
  id: thread_id
}: Pick<ThreadEntity, 'id'>) {
  const api = createClient();
  
  const { data: existingThreadImages, status, error: existingThreadImagesErr } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id)
  .single();
  
  if (existingThreadImagesErr && status !== 406) {
    throw new Error(existingThreadImagesErr.message);
  }

  if (!existingThreadImages || !existingThreadImages.images || existingThreadImages.images.length === 0) {
    return;
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
  id
}: Pick<ThreadEntity, 'id'>) {
  await threadImagesRemove({ id });
  await threadRemove({ id });
  
  return true;
}