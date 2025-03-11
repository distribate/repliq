import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { authClient } from "@repo/shared/api/auth-client";
import type { InferResponseType } from "hono/client"

export const USER_ACTIVE_SESSIONS_QUERY_KEY = createQueryKey("user", ["active-sessions"])

const client = authClient["get-sessions"].$get

export type GetUserActiveSessionsResponse = InferResponseType<typeof client, 200>["data"]

const getUserSessions = async () => {
  const res = await authClient["get-sessions"].$get()
  const data = await res.json()

  if (!data || 'error' in data) {
    return null;
  }

  return data.data
}

export const userActiveSessionsQuery = () => useQuery({
  queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY,
  queryFn: () => getUserSessions(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});