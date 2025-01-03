"use server"

import { getCurrentSession } from "@repo/lib/actions/get-current-session"
import { forumUserClient } from "@repo/shared/api/forum-client"

export const checkNotification = async (notification_id: string) => {
  const { user: currentUser } = await getCurrentSession()
  if (!currentUser) return

  const res = await forumUserClient.user["check-notification"][":nickname"].$post({
    param: {
      nickname: currentUser.nickname
    },
    json: {
      notification_id
    }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return { error: data.error };
  }

  return data;
}