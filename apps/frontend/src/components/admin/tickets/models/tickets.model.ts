import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { adminClient } from "#shared/forum-client"
import { validateResponse } from "#shared/api/validation"

export type TicketsPayload = Awaited<ReturnType<typeof ticketsAction>>

export const ticketsAction = reatomAsync(async (ctx) => {
	return await ctx.schedule(async () => {
		const res = await adminClient.private["tickets"].$get(
			{}, { init: { signal: ctx.controller.signal } }
		)
		return validateResponse<typeof res>(res);
	})
}, {
	name: "ticketsAction",
	onReject: (_, e) => {
		if (e instanceof Error) {
			console.error(e.message)
		}
	}
}).pipe(withDataAtom(), withStatusesAtom())