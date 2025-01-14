import { forumUserClient } from "@repo/shared/api/forum-client";

export const getNotifications = async () => {
  const res = await forumUserClient().user["get-user-notifications"].$get()

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data
}