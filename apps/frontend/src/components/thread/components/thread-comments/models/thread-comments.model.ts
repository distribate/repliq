import { GetThreadCommentsResponse } from '@repo/types/entities/thread-comments-types.ts';
import { atom, batch, Ctx } from '@reatom/core';
import { reatomAsync, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { threadParamAtom } from '#components/thread/models/thread.model';
import { threadClient } from '#shared/forum-client.ts';
import { getCommentsSchema } from "@repo/types/schemas/comment/get-comments-schema.ts";
import * as z from "zod";
import { withReset } from '@reatom/framework';
import { isParamChanged } from '#components/profile/main/models/requested-user.model';
import { isAuthenticatedAtom } from '#components/auth/models/auth.model';
import { validateResponse } from '#shared/api/validation';

type ThreadComments = GetThreadCommentsResponse

export const threadCommentsDataAtom = atom<ThreadComments["data"] | null>(null, "threadCommentsData").pipe(withReset())
export const threadCommentsMetaAtom = atom<ThreadComments["meta"] | null>(null, "threadCommentsMeta").pipe(withReset())

export function resetThreadComments(ctx: Ctx) {
  threadCommentsDataAtom.reset(ctx)
  threadCommentsMetaAtom.reset(ctx)
}

export type GetThreadComments = z.infer<typeof getCommentsSchema> & {
  threadId: string
}

export async function getThreadComments({
  threadId, cursor, limit
}: GetThreadComments) {
  const query: Record<string, string | undefined> = {
    limit: limit?.toString(), cursor: cursor ?? undefined,
  };

  const res = await threadClient.thread['comments'][':id'].$get({
    query, param: { id: threadId }
  });

  return validateResponse<typeof res>(res)
}

threadParamAtom.onChange((ctx, state) => isParamChanged(ctx, threadParamAtom, state, () => {
  threadCommentsAction(ctx)
}))

export const threadCommentsAction = reatomAsync(async (ctx) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;

  const threadId = ctx.get(threadParamAtom)
  if (!threadId) return;

  return await ctx.schedule(() => getThreadComments({ threadId }))
}, {
  name: "threadCommentsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      threadCommentsDataAtom(ctx, res.data)
      threadCommentsMetaAtom(ctx, res.meta)
    })
  }
}).pipe(withStatusesAtom(), withErrorAtom())