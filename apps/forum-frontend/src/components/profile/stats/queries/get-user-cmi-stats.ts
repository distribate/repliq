import { forumUserClient } from "@repo/shared/api/forum-client";

async function getUserStats(nickname: string) {
  const res = await forumUserClient.user["get-user-game-stats"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if (!data || "error" in data) return null

  return data.data
}

export async function getMainUserState(nickname: string) {
  return await getUserStats(nickname);
}