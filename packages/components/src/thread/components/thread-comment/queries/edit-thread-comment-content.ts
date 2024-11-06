'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { validateOwner } from '@repo/lib/helpers/validate-owner.ts';
import { ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';

export async function editThreadCommentContent({
  id, thread_id, content,
}: Pick<ThreadCommentEntity, "id" | "thread_id" | "content">) {
  const isValid = await validateOwner({ id, type: "threads_comments" })
  if (!isValid) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .update({ content })
  .eq('thread_id', thread_id)
  .eq('id', id)
  .select('id, content, edited')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}