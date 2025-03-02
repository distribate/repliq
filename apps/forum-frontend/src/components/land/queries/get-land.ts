import { landsClient } from "@repo/shared/api/minecraft-client"

export async function getLandById(id: string) {
  const res = await landsClient.lands['get-land'][':id'].$get({
    param: { id },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null

  return data
}