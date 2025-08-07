import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumUserClient } from "#shared/forum-client";

async function getMyThreads() {
  const res = await forumUserClient.user["get-my-threads"].$get();
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data;
}

async function getSavedThreads() {
  const res = await forumUserClient.user["get-saved-threads"].$get()
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data;
}

export const myThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getMyThreads())
}, "myThreadsAction").pipe(withDataAtom(), withStatusesAtom())

export const savedThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getSavedThreads())
}, "savedThreadsAction").pipe(withDataAtom(), withStatusesAtom())