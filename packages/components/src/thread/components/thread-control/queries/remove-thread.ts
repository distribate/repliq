"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { validateThreadOwner } from '#thread/components/thread-control/queries/validate-thread-owner.ts';

async function threadImagesRemove(thread_id: Pick<ThreadEntity, 'id'>["id"]) {
  const api = createClient();
  
  const { data: existingThreadImages, status, error: existingThreadImagesErr } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id)
  .single();
  
  if (existingThreadImagesErr && status !== 406) {
    throw new Error(existingThreadImagesErr.message);
  }

  if (!existingThreadImages
    || !existingThreadImages.images
    || existingThreadImages.images.length === 0
  ) {
    return;
  }
  
  const { error: removeImagesFromStorage } = await api
  .storage
  .from('threads')
  .remove(existingThreadImages.images);
  
  if (removeImagesFromStorage) {
    throw new Error(removeImagesFromStorage.message);
  }
}

export async function removeThread({
  id
}: Pick<ThreadEntity, 'id'>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const isValid = await validateThreadOwner({
    threadId: id, currentUserNickname: currentUser.nickname
  })
  
  if (!isValid) return;
  
  const api = createClient();
  
  await threadImagesRemove(id);
  
  const { error } = await api
  .from('threads')
  .delete()
  .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return !error;
}