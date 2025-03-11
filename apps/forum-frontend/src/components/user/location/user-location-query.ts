import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { useQuery } from "@tanstack/react-query";

async function getUserLocation(nickname: string) {
  const res = await forumUserClient.user["get-user-location"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if ("error" in data) {
    const error = data.error

    if (error === 'restricted') {
      return "restricted"
    }

    return null;
  }

  return data.data
}

export const USER_LOCATION_QUERY_KEY = (nickname: string) => 
  createQueryKey("user", ["location"], nickname)

export const userLocationQuery = (nickname: string) => useQuery({
  queryKey: USER_LOCATION_QUERY_KEY(nickname),
  queryFn: () => getUserLocation(nickname),
  refetchOnWindowFocus: false
})
