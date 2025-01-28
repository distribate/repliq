import { forumCategoriesClient } from "@repo/shared/api/forum-client"

export async function getAvailableCategories() {
  const res = await forumCategoriesClient.categories["get-available-categories"].$get()

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data.data
}