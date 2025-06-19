import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumAdminClient } from "@repo/shared/api/forum-client"

async function getTickets() {
	const res = await forumAdminClient.private["get-tickets"].$get()
	const data = await res.json()

	if ("error" in data) return null

	return data.data
}

export const ticketsResource = reatomResource(async (ctx) => {
	return await ctx.schedule(getTickets)
}).pipe(withDataAtom(), withStatusesAtom(), withCache())