import { globalPreferencesAtom } from "#components/user/settings/main/models/update-global-preferences.model"
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumSharedClient } from "@repo/shared/api/forum-client"

async function getServerStatus() {
  const res = await forumSharedClient.shared["get-status"].$get({ query: { type: "servers" }})
  const data = await res.json()

  if ("error" in data) return null

  return data
}

// todo: impl refetch
export const REFETCH_INTERVAL = 60000

export const statusResource = reatomResource(async (ctx) => {
  const isEnabled = ctx.spy(globalPreferencesAtom).intro === 'show'

  if (!isEnabled) return;

  return await ctx.schedule(() => getServerStatus())
}, "statusResource").pipe(withDataAtom(), withCache(), withStatusesAtom())
