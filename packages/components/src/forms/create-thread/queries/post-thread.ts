'use server';

import 'server-only';
import { ThreadEntity } from '@repo/types/entities/entities-type';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { postThreadImages } from './post-thread-images.ts';

export type PostThread = {
  thread_id: string
}

type PostThreadProperties = Omit<ThreadEntity, 'content'> & Partial<{
  user_nickname: string,
  category_id: number,
  tags: string[] | null
}> & PostThread & {
  content: any
};

export async function postThreadCategory({
  thread_id, category_id,
}: Pick<PostThreadProperties, 'thread_id' | 'category_id'>) {
  const api = createClient();
  
  const { data, error } = await api
  .from('category_threads')
  .insert({
    category_id: category_id,
    thread_id: thread_id,
  })
  .select('thread_id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function postThreadNickname({
  thread_id, user_nickname,
}: Pick<PostThreadProperties, 'thread_id' | 'user_nickname'>) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_users')
  .insert({
    thread_id: thread_id,
    user_nickname: user_nickname,
  })
  .select('thread_id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function postThreadItem({
  ...values
}: Partial<Omit<ThreadEntity, 'id' | 'created_at'>>) {
  const { comments, auto_remove, content, permission, description, title } = values;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .insert({
    title: title, description: description,
    content: content, comments: comments,
    permission: permission, auto_remove: auto_remove,
  })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

async function postThreadTags({
  ...values
}: Pick<PostThreadProperties, 'thread_id' | 'tags'>) {
  const { tags, thread_id } = values;
  
  if (!tags) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_tags')
  .insert({
    thread_id, tags,
  })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

type PostThreadType = Omit<PostThreadProperties, 'thread_id' | 'created_at' | 'id' | 'updated_at'> & {
  base64Files: Array<string> | null
}

export async function postThread({
  ...values
}: PostThreadType) {
  const {
    category_id, content, comments, title, tags, permission,
    description, auto_remove, user_nickname, base64Files
  } = values;
  
  if (!content || !title || !user_nickname) return;
  
  const { id } = await postThreadItem({
    content: JSON.parse(content),
    comments,
    auto_remove,
    title,
    description,
    permission
  });
  
  if (!id) return;
  
  console.log(base64Files)
  
  if (base64Files) {
    await postThreadImages({ thread_id: id, base64Files });
  }
  
  await postThreadNickname({ thread_id: id, user_nickname });
  await postThreadCategory({ thread_id: id, category_id });
  await postThreadTags({ thread_id: id, tags });
  
  return { thread_id: id };
}