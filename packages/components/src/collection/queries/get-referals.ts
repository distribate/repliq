import { forumUserClient } from "@repo/shared/api/forum-client"

export const getReferals = async (nickname: string) => {
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