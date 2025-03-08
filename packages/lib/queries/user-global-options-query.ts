import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumUserClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"

async function getUserGlobalOptions() {
  const res = await forumUserClient.user["get-user-global-options"].$get()

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.data;
}

export const USER_GLOBAL_OPTIONS_QUERY_KEY = createQueryKey("ui", ["user-global-options"])

export const userGlobalOptionsQuery = () => useQuery({
  queryKey: USER_GLOBAL_OPTIONS_QUERY_KEY,
  queryFn: () => getUserGlobalOptions(),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})