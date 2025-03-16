import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { landsClient } from "@repo/shared/api/minecraft-client";
import { useQuery } from "@tanstack/react-query";

export async function getLands() {
  const res = await landsClient.lands['get-lands'].$get({
    query: {
      cursor: '',
    },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null

  return data
}

export const LANDS_QUERY_KEY = createQueryKey("ui", ["lands"])

export const landsOpts = {
  queryKey: LANDS_QUERY_KEY,
  queryFn: () => getLands(),
  refetchOnWindowFocus: false
}

export const landsQuery = () => useQuery({
  ...landsOpts,
})