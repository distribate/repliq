import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"

async function getPurchases() {
  const res = await forumUserClient.user["get-user-purchases"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

export const purchasesQuery = () => useQuery({
  queryKey: createQueryKey("user", ["purchases"]),
  queryFn: getPurchases,
  refetchOnWindowFocus: false,
  refetchOnMount: false
})