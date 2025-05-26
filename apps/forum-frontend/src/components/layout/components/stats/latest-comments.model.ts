import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumCommentClient } from "@repo/shared/api/forum-client"

const getLatestComments = async () => {
  const res = await forumCommentClient.comment["get-last-comments"].$get()
  const data = await res.json()

  if ("error" in data) return null

  return data.data.length >= 1 ? data.data : null;
}

export const latestCommentsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getLatestComments())
}, "latestCommentsResource").pipe(withDataAtom(), withStatusesAtom(), withCache())