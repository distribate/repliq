import { forumUserClient } from "@repo/shared/api/forum-client"

export const checkNotification = async (notification_id: string) => {
  const res = await forumUserClient().user["check-notification"].$post({
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