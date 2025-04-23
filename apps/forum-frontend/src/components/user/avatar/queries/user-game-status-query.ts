import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "./get-user-status";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { formatIssuedTime } from "@repo/lib/helpers/format-status-time";

export const USER_STATUS_QUERY_KEY = (nickname: string) => createQueryKey("user", ["game-status"], nickname);

export const userGameStatusQuery = (nickname: string, enabled: boolean) => useQuery({
  queryKey: USER_STATUS_QUERY_KEY(nickname),
  queryFn: async () => {
    const res = await getUserStatus(nickname)

    if (!res) return null;

    const issuedTime = formatIssuedTime(res?.issued_date ?? null)

    return { ...res, issued_date: issuedTime }
  },
  refetchOnWindowFocus: true,
  retry: 1,
  enabled
});