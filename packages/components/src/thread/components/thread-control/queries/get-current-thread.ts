'use server';

import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export async function getCurrentThread(id: Pick<ThreadModel, 'id'>["id"]): Promise<
  Pick<ThreadEntity, "id" | "title" | "description" | "isComments" | "permission" | "content">
> {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .select('id, title, description, isComments, permission, content')
  .eq('id', id)
  .single()
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data
}