import { landsClient } from "@repo/shared/api/minecraft-client";

export async function getUserLands(
  nickname: string
) {
  const res = await landsClient.lands['get-user-lands'][':nickname'].$get({
    param: { nickname },
    query: { exclude: undefined },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null;

  return data.data;
}