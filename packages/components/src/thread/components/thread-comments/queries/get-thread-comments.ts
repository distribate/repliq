'use server';

import { forumThreadClient } from '@repo/lib/utils/api/forum-client.ts';
import { z } from 'zod';
import { getThreadCommentsSchema } from '@repo/types/schemas/thread/get-thread-comments-schema.ts';

type GetThreadComments = {
  thread_id: string;
} & z.infer<typeof getThreadCommentsSchema>;

export async function getThreadComments({
  thread_id, ...filter
}: GetThreadComments) {
  const { limit, range, ascending } = filter;
  
  const res = await forumThreadClient.thread['get-thread-comments'][':threadId'].$get({
    query: {
      range: `${range[0]},${range[1]}`,
      ascending: ascending?.toString(),
      limit: limit?.toString() ?? undefined
    },
    param: {
      threadId: thread_id,
    },
  });
  
  const data = await res.json();
  
  if (!data || 'error' in data) {
    console.error(data?.error);
    return null;
  }
  
  return data;
}