import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';
import { forumSharedClient } from "#shared/forum-client.ts";
import ky from "ky";
import { decode } from "cbor-x"

type LatestRegUser = {
  id: string;
  description: string | null;
  name_color: string;
  nickname: string;
  avatar: string | null
}

export const getLatestRegUsers = async (
  limit?: number,
  init?: RequestInit
) => {
  const url = forumSharedClient.shared["get-latest-reg-users"].$url({
    query: { limit: limit ? `${limit}` : undefined } }
  )

  const res = await ky.get(url, { credentials: "include", ...init })

  const encodedData = await res.arrayBuffer()
  if (!encodedData) return null

  const uint8Data = new Uint8Array(encodedData)
  const data: Array<LatestRegUser> = decode(uint8Data)

  if (!data || "error" in data) return null

  return data
};

export const latestUsersAction = reatomAsync(async (ctx, options?: { limit: number }) => {
  return await ctx.schedule(() => getLatestRegUsers(options?.limit))
}, "latestUsersAction").pipe(withStatusesAtom(), withDataAtom())