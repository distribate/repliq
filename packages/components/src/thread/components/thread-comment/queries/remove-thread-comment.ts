'use server';

import { createClient } from '../../../../../../lib/utils/api/supabase-client.ts';
import { validateOwner } from '@repo/lib/helpers/validate-owner.ts';
import { ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';

export type RemoveThreadComment = Omit<Pick<ThreadCommentEntity, "thread_id" | "id" | "content">, "content">

export async function removeThreadComment({
  id, thread_id
}: RemoveThreadComment) {
  const isValid = await validateOwner({ type: "threads_comments", id })
  if (!isValid) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .delete()
  .eq('thread_id', thread_id)
  .eq("id", id)
  .select()
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}