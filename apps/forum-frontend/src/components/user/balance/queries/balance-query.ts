import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { playerClient } from "@repo/shared/api/minecraft-client";
import { useQuery } from "@tanstack/react-query";

async function getUserBalance(nickname: string) {
  const res = await playerClient.player["get-player-balance"].$get({
    param: { nickname }
  });

  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const USER_BALANCE_QUERY_KEY = createQueryKey("user", ["balance"]);

export const userBalanceQuery = (nickname: string) => useQuery({
  queryKey: USER_BALANCE_QUERY_KEY,
  queryFn: () => getUserBalance(nickname),
  refetchOnWindowFocus: false,
  retry: 1
})