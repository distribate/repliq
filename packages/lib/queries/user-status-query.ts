import { formatIssuedTime } from "#helpers/format-status-time.ts";
import { createQueryKey } from "#helpers/query-key-builder.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { useQuery } from "@tanstack/react-query";

async function getUserStatus(nickname: string) {
  const res = await forumUserClient.user["get-user-status"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.data;
}

export const userStatusQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey("user", ["status-state", nickname]),
  queryFn: async () => {
    const res = await getUserStatus(nickname)

    if (!res) return null;

    const issuedTime = formatIssuedTime(res.last_active ?? null)

    return { ...res, last_active: issuedTime }
  },
});