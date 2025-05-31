import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { threadParamAtom } from "#components/thread/thread-main/models/thread.model";
import { forumThreadClient } from "@repo/shared/api/forum-client";

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
}, "threadImagesAction").pipe(withDataAtom(), withStatusesAtom())