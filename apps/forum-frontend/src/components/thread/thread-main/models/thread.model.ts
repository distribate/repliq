import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type";
import { withHistory } from "@repo/lib/utils/with-history";
import { forumThreadClient } from "@repo/shared/api/forum-client";

export async function getThreadModel(threadId: string) {
  const res = await forumThreadClient.thread['get-thread'][':threadId'].$get({ param: { threadId }, });
  const data = await res.json();

  if (!data || 'error' in data) return null;

  return data.data;
}

export const threadParamAtom = atom<string | null>(null, "threadParam").pipe(withHistory(1))
export const threadAtom = atom<UnwrapPromise<ReturnType<typeof getThreadModel>> | null>(null, "thread").pipe(withReset())

threadParamAtom.onChange((ctx, target) => {
  if (!target) return;

  const prev = ctx.get(threadParamAtom.history)[1]

  if (prev !== undefined && prev !== target) {
    threadAtom.reset(ctx)
  }

  threadAction(ctx, target)
})

export const threadAction = reatomAsync(async (ctx, threadId: string) => {
  return await ctx.schedule(() => getThreadModel(threadId))
}, {
  name: "threadAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return;
    }

    threadAtom(ctx, res)
  }
}).pipe(withStatusesAtom())