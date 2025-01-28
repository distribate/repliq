import { forumUserClient } from "@repo/shared/api/forum-client"

export async function deleteCoverImage() {
  const res = await forumUserClient.user["delete-cover-image"].$delete()

  const data = await res.json()

  if (!data || "error" in data) {
    return null
  }

  return data
}