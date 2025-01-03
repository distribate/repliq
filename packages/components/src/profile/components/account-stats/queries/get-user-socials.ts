"use server"

import { forumUserClient } from "@repo/shared/api/forum-client"
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export const getUserSocials = async () => {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["get-user-socials"][":nickname"].$get({
    param: {
      nickname: currentUser.nickname,
    }
  })

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data
}