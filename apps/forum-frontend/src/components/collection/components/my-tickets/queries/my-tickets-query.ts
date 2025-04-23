import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"

async function getTickets(nickname: string) {
  const res = await forumUserClient.user["get-user-tickets"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

export const myTicketsQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey("user", ["tickets"]),
  queryFn: () => getTickets(nickname),
  refetchOnWindowFocus: false,
})