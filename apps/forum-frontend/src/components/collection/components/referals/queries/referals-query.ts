import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { useQuery } from "@tanstack/react-query";

import { forumUserClient } from "@repo/shared/api/forum-client";
const getReferals = async (nickname: string) => {
  const res = await forumUserClient.user["get-user-referals"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data.length > 0 ? data.data : null
}

export const referalsQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey('user', ['referals', nickname]),
  queryFn: () => getReferals(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})