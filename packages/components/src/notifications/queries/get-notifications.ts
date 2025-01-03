"use server"

import { getCurrentSession } from "@repo/lib/actions/get-current-session"
import { forumUserClient } from "@repo/shared/api/forum-client";

export const getNotifications = async () => {
  const { user: currentUser } = await getCurrentSession()
  if (!currentUser) return null;

  const res = await forumUserClient.user["get-user-notifications"][":nickname"].$get({
    param: {
      nickname: currentUser.nickname
    }
  })

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data
}