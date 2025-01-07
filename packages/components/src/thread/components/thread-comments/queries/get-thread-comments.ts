import { forumThreadClient } from '@repo/shared/api/forum-client.ts';
import { getCommentsSchema } from "@repo/types/schemas/comment/get-comments-schema.ts";
import { z } from 'zod';

export type GetThreadComments = z.infer<typeof getCommentsSchema> & {
  threadId: string
}

export async function getThreadComments({
  threadId, cursor, limit
}: GetThreadComments) {
  const query: Record<string, string | undefined> = {
    limit: limit?.toString(),
    cursor: cursor ?? undefined,
  };

  const res = await forumThreadClient.thread['get-thread-comments'][':threadId'].$get({
    query,
    param: { threadId },
  });

  const data = await res.json();

  if (!data || 'error' in data) {
    return null;
  }

  return data;
}