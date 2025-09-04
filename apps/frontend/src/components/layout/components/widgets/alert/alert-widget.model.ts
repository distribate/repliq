import { reatomAsync, withCache, withDataAtom, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { sharedClient } from "#shared/forum-client"

export const alertsCursorAtom = atom<string | undefined>(undefined, "alertsCursorAtom")
export const alertsLimitAtom = atom(1, "alertsLimitAtom")

async function getAlert() {
  const res = await sharedClient.shared["get-alert"].$get()
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data
}

export const alertsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getAlert())
}).pipe(withDataAtom(), withStatusesAtom(), withCache(), withErrorAtom())