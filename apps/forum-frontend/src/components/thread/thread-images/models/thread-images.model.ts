import { atom } from "@reatom/core";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { threadParamAtom } from "#components/thread/thread-main/models/thread.model";
import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type.ts";
import { forumThreadClient } from "@repo/shared/api/forum-client";

export const threadImagesAtom = atom<UnwrapPromise<ReturnType<typeof getThreadImages>> | null>(null, "threadImages")

export const getThreadImages = async (id: string) => {
  const res = await forumThreadClient.thread["get-thread-images"][":id"].$get({
    param: { id },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

export const threadImagesAction = reatomAsync(async (ctx) => {
  const target = ctx.get(threadParamAtom)
  if (!target) return;

  return await ctx.schedule(() => getThreadImages(target))
}, {
  name: "threadImagesAction",
  onFulfill: (ctx, res) => {
    if (!res) return
    threadImagesAtom(ctx, res)
  }
}).pipe(withStatusesAtom())