import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumUserClient } from "#shared/forum-client";

export const myThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-my-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );
    
    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, {
  name: "myThreadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())

export const savedThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-saved-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )

    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, {
  name: "savedThreadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())