import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const FRIEND_STATUS_QUERY_KEY = (recipient: string) => createQueryKey("user", ["friend-status", recipient])

const getUserFriendStatus = async (recipient: string) => {
  const res = await forumUserClient.user["get-friend-status"][":nickname"].$get({
    param: {
      nickname: recipient
    }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

export const friendStatusQuery = (initiator: string, recipient: string) => useSuspenseQuery({
  queryKey: FRIEND_STATUS_QUERY_KEY(recipient),
  queryFn: async () => {
    if (initiator === recipient) {
      return null
    }

    return await getUserFriendStatus(recipient)
  },
  refetchOnMount: false,
  refetchOnWindowFocus: false
})