import { forumUserClient } from "@repo/shared/api/forum-client";
import type { InferResponseType } from "hono/client"

type GetNotifications = {
  type: "system" | "requests" | "news",
  cursor?: string
}

const client = forumUserClient.user["get-user-notifications"].$get

export type GetNotificationsResponse = InferResponseType<typeof client, 200>

export const getNotifications = async ({
  type, cursor
}: GetNotifications) => {
  const res = await forumUserClient.user["get-user-notifications"].$get({
    query: { type, cursor, }
  })

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data
}