"use server"

import { getCurrentSession } from "@repo/lib/actions/get-current-session"
import { getUserSessionCookie } from "@repo/lib/actions/get-user-session-cookie";
import { forumUserClient } from "@repo/shared/api/forum-client";

export const getNotifications = async () => {
  const { user: currentUser } = await getCurrentSession()
  if (!currentUser) return null;

  const sessionToken = await getUserSessionCookie()
  if (!sessionToken) return null

  const res = await forumUserClient(sessionToken).user["get-user-notifications"][":nickname"].$get({
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