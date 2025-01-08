import { forumUserClient } from "@repo/shared/api/forum-client";

export async function getFriendsCount(nickname: string) {
  const res = await forumUserClient().user["get-user-friends-count"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.count
}