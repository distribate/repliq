import { threadAtom } from "#components/thread/thread-main/models/thread.model"
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumThreadClient } from "@repo/shared/api/forum-client"

type GetThreadsRecommendations = {
  exclude: string,
  nickname: string
}

async function getThreadsRecommendations({
  exclude, nickname
}: GetThreadsRecommendations) {
  const res = await forumThreadClient.thread["get-threads-by-owner"][":nickname"].$get({
    param: { nickname }, query: { exclude }
  })
  const data = await res.json()
  if (!data || "error" in data) return null
  return data
}

export const threadRecommendationsResource = reatomResource(async (ctx) => {
  const target = ctx.spy(threadAtom)
  if (!target) return;
  return await getThreadsRecommendations({ exclude: target.id, nickname: target.owner.nickname })
}, "threadRecommendationsResource").pipe(withDataAtom(), withCache(), withStatusesAtom())