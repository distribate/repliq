'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { THREAD } from '@repo/types/entities/entities-type';

export type PostThread = {
  thread_id: string
}

type PostThreadProperties = Omit<THREAD, "content"> & Partial<{
  user_nickname: string,
  category_id: number,
  tags: string[] | null
}> & PostThread & {
  content: any
};

const supabase = createClient();

export async function postThreadCategory({
  thread_id, category_id,
}: Pick<PostThreadProperties, 'thread_id' | 'category_id'>) {
  const { data, error } = await supabase
  .from('category_threads')
  .insert({
    category_id: category_id,
    thread_id: thread_id,
  })
  .select('thread_id')
  .single();
  
  if (error) throw new Error(error.message);
  
  return data;
}

export async function postThreadNickname({
  thread_id, user_nickname,
}: Pick<PostThreadProperties, 'thread_id' | 'user_nickname'>) {
  const { data, error } = await supabase
  .from('threads_users')
  .insert({
    thread_id: thread_id,
    user_nickname: user_nickname,
  })
  .select('thread_id')
  .single();
  
  if (error) throw new Error(error.message);
  
  return data;
}

export async function postThreadItem({
  ...values
}: Partial<Omit<THREAD, 'id' | 'created_at'>>) {
  const { comments, auto_remove, content, permission, description, title } = values;
  
  const { data, error } = await supabase
  .from('threads')
  .insert({
    title: title, description: description,
    content: content, comments: comments,
    permission: permission, auto_remove: auto_remove,
  })
  .select('id')
  .single();
  
  if (error) {
    console.error(error.message)
    throw new Error(error.message);
  }
  
  return data;
}

async function postThreadTags({
  ...values
}: Pick<PostThreadProperties, 'thread_id' | 'tags'>) {
  const { tags, thread_id } = values;
  
  const { data, error } = await supabase
  .from('threads_tags')
  .insert({
    thread_id, tags,
  })
  .select('id')
  .single();
  
  if (error) throw new Error(error.message);
  
  return data;
}

export async function postThread({
  ...values
}: Omit<PostThreadProperties, 'thread_id' | 'created_at' | 'id' | "updated_at">) {
  const {
    category_id, content, comments, title, tags,
    permission, description, auto_remove, user_nickname,
  } = values;
  
  if (!content || !title || !user_nickname) return;
  
  const { id } = await postThreadItem({
    content: JSON.parse(content), comments,
    auto_remove, title, description, permission,
  });
  
  if (!id) return;
  
  await Promise.all([
    postThreadNickname({
      thread_id: id, user_nickname,
    }),
    postThreadCategory({
      thread_id: id, category_id,
    }),
    postThreadTags({
      thread_id: id, tags,
    }),
  ]);
  
  return { thread_id: id };
}