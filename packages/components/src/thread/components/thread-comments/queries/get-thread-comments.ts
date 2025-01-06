import { forumThreadClient } from '@repo/shared/api/forum-client.ts';

type GetThreadComments = {
  thread_id: string;
  cursor: string | null;
  limit: number | null
}

export async function getThreadComments({
  thread_id, ...filter
}: GetThreadComments) {
  const { limit, cursor } = filter;

  const query: Record<string, string | undefined> = {
    limit: limit?.toString(),
    cursor: cursor ?? undefined,
  };

  const res = await forumThreadClient.thread['get-thread-comments'][':threadId'].$get({
    query,
    param: {
      threadId: thread_id,
    },
  });

  const data = await res.json();

  if (!data || 'error' in data) {
    return null;
  }

  return data;
}