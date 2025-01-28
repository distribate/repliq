import { forumThreadClient } from "@repo/shared/api/forum-client"

export async function getLastThreads(limit: number) {
  const res = await forumThreadClient.thread["get-latest-threads"].$get({
    query: {
      limit: `${limit}`
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}