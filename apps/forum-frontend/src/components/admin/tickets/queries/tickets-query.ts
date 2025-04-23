import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumAdminClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"

async function getTickets() {
	const res = await forumAdminClient.admin["get-tickets"].$get()

	const data = await res.json()

	if ("error" in data) {
		return null
	}

	return data.data
}

export const ticketsQuery = () => useQuery({
	queryKey: createQueryKey("ui", ["tickets"]),
	queryFn: getTickets,
	refetchOnWindowFocus: false,
	refetchOnMount: false
})