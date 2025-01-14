import { createQueryKey } from "#helpers/query-key-builder.ts";
import { forumWsClient } from "@repo/shared/api/forum-client";
import { useQuery } from "@tanstack/react-query";

export const WEBSOCKET_TOKEN_QUERY_KEY = createQueryKey("user", ["ws-token"])

export const websocketTokenQuery = () => useQuery({
  queryKey: WEBSOCKET_TOKEN_QUERY_KEY,
  queryFn: async () => {
    const res = await forumWsClient.ws["confirm-websocket-conn"].$get();

    const data = await res.json();

    if (!data || "error" in data) {
      return null;
    }

    return data;
  },
  refetchOnWindowFocus: false
})