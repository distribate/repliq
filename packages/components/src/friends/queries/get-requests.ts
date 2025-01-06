import { forumUserClient } from "@repo/shared/api/forum-client";

export async function getRequests(nickname: string) {
  const res = await forumUserClient().user["get-friend-requests"].$get({
    query: {
      type: "outgoing"
    }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data;
}