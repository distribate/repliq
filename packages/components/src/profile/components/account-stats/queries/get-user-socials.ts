import { forumUserClient } from "@repo/shared/api/forum-client"

export const getUserSocials = async (nickname: string) => {
  const res = await forumUserClient.user["get-user-socials"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data.data
}