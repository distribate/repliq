import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { adminClient } from "#shared/forum-client"
import { sleep } from "@reatom/framework"

export const ticketsAction = reatomAsync(async (ctx) => {
	await ctx.schedule(() => sleep(140));

	return await ctx.schedule(async () => {
		const res = await adminClient.private["get-tickets"].$get()
		const data = await res.json()

		if ("error" in data) throw new Error(data.error)

		return data.data
	})
}, {
	name: "ticketsAction",
	onReject: (_, e) => {
		if (e instanceof Error) {
			console.error(e.message)
		}
	}
}).pipe(withDataAtom(), withStatusesAtom())