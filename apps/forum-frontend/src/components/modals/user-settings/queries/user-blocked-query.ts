import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';

export const USER_BLOCKED_QUERY_KEY = createQueryKey("user", ["blocked-users"])

async function getUserBlocked() {
  const res = await forumUserClient.user["get-blocked-users"].$get({
    query: {
      cursor: "1"
    }
  })
  
  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data.length ? data.data : null
}

export const userBlockedQuery = () => useQuery({
  queryKey: USER_BLOCKED_QUERY_KEY,
  queryFn: () => getUserBlocked(),
  refetchOnWindowFocus: false
});