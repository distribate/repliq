import { createQueryKey } from "#helpers/query-key-builder.ts";
import { forumLandingClient } from "@repo/shared/api/forum-client.ts";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { decode } from "cbor-x"

export const getLatestRegUsers = async (limit?: number) => {
  const url = forumLandingClient["get-latest-reg-users"].$url({
    query: {
      limit: limit ? `${limit}` : undefined
    }
  })

  const res = await ky.get(url, {
    credentials: "include",
  })

  const encodedData = await res.arrayBuffer()

  if (!encodedData) {
    return null
  }

  const uint8Data = new Uint8Array(encodedData)

  const data: {
    id: string;
    description: string | null;
    name_color: string;
    nickname: string;
  }[] = decode(uint8Data)

  if ("error" in data) {
    return null
  }

  return data
};

export const LATEST_REG_USERS_QUERY_KEY = createQueryKey("ui", ["last-users"])

export const latestUsersQuery = () => useQuery({
  queryKey: LATEST_REG_USERS_QUERY_KEY,
  queryFn: () => getLatestRegUsers(),
  refetchOnWindowFocus: false,
})