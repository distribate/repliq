import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { landsClient } from "@repo/shared/api/minecraft-client"
import { useQuery } from "@tanstack/react-query"

export type AnotherLandsByOwner = {
  nickname: string
  exclude: string
}

async function getAnotherLandsByOwner(nickname: string, exclude: string) {
  const res = await landsClient.lands['get-user-lands'][':nickname'].$get({
    param: { nickname },
    query: { exclude },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null

  return data.data.length > 0 ? data.data : null
}

const ANOTHER_LANDS_BY_OWNER_QUERY_KEY = (nickname: string, exclude: string) => 
  createQueryKey('ui', ['lands', nickname, exclude])

export const anotherLandsByOwnerQuery = ({
  exclude, nickname
}: AnotherLandsByOwner) => useQuery({
  queryKey: ANOTHER_LANDS_BY_OWNER_QUERY_KEY(nickname, exclude),
  queryFn: () => getAnotherLandsByOwner(nickname, exclude),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
})
