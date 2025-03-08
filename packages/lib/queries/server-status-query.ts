import { forumSharedClient } from "@repo/shared/api/forum-client";
import { useQuery } from "@tanstack/react-query";

export type Player = {
  uuid: string;
  name_raw: string;
};

async function getServerStatus() {
  const res = await forumSharedClient.shared["get-status"].$get({
    query: {
      type: "servers"
    }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.data;
}

export const SERVER_STATUS_QUERY_KEY = ["server-status", "global"];

export const serverStatusQuery = () => useQuery({
  queryKey: SERVER_STATUS_QUERY_KEY,
  queryFn: getServerStatus,
  refetchInterval: 60000,
  refetchOnWindowFocus: false,
  retry: 1
});