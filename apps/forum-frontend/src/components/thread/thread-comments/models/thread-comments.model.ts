import { GetThreadCommentsResponse } from '@repo/types/entities/thread-comments-types.ts';
import { atom } from '@reatom/core';
import { reatomAsync, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { threadParamAtom } from '#components/thread/thread-main/models/thread.model';
import { forumThreadClient } from '#shared/forum-client.ts';
import { getCommentsSchema } from "@repo/types/schemas/comment/get-comments-schema.ts";
import * as z from "zod";

export const threadCommentsDataAtom = atom<Pick<GetThreadCommentsResponse, "data">["data"] | null>(null, "threadCommentsData")
export const threadCommentsMetaAtom = atom<Pick<GetThreadCommentsResponse, "meta">["meta"] | null>(null, "threadCommentsMeta")

export type GetThreadComments = z.infer<typeof getCommentsSchema> & {
  threadId: string
}

export async function getThreadComments({
  threadId, cursor, limit
}: GetThreadComments) {
  const query: Record<string, string | undefined> = {
    limit: limit?.toString(), cursor: cursor ?? undefined,
  };

  const res = await forumThreadClient.thread['get-thread-comments'][':threadId'].$get({
    query, param: { threadId },
  });

  const data = await res.json();

  if (!data || 'error' in data) return null;

  return data;
}

export const threadCommentsAction = reatomAsync(async (ctx) => {
  const target = ctx.get(threadParamAtom)
  if (!target) return;

  return await ctx.schedule(() => getThreadComments({ threadId: target }))
}, {
  name: "threadCommentsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    threadCommentsDataAtom(ctx, res.data)
    threadCommentsMetaAtom(ctx, res.meta)
  }
}).pipe(withStatusesAtom(), withErrorAtom())