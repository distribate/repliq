import { useQuery } from "@tanstack/react-query";
import { forumSharedClient } from "@repo/shared/api/forum-client";

async function getServerIp(): Promise<string  | null> {
  const res = await forumSharedClient.shared["get-server-ip"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data?.ip ?? null;
}

export const serverIpQuery = () => useQuery({
	queryKey: ["server-ip"],
	queryFn: () => getServerIp(),
	refetchOnWindowFocus: false,
	refetchOnMount: false
})