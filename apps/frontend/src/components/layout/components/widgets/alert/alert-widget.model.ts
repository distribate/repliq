import { reatomResource, withCache, withDataAtom, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { forumSharedClient } from "#shared/forum-client"

export const alertsCursorAtom = atom<string | undefined>(undefined, "alertsCursorAtom")
export const alertsLimitAtom = atom(1, "alertsLimitAtom")

async function getAlerts({ cursor, limit }: { cursor: string | undefined, limit: number }) {
  const res = await forumSharedClient.shared["get-alerts"].$get({
    query: { cursor: cursor, limit: `${limit}` }
  })

  const data = await res.json()

  if ("error" in data) return null

  return data
}

export const alertsResource = reatomResource(async (ctx) => {
  const cursor = ctx.spy(alertsCursorAtom)
  const limit = ctx.spy(alertsLimitAtom)

  return await ctx.schedule(() => getAlerts({ cursor, limit }))
}).pipe(withDataAtom(), withStatusesAtom(), withCache(), withErrorAtom())