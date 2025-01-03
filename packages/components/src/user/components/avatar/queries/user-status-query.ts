import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "./get-user-status";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";

export const USER_STATUS_QUERY_KEY = (nickname: string) => createQueryKey("user", ["game-status"], nickname);

export const userStatusQuery = (nickname: string, enabled: boolean) => useQuery({
  queryKey: USER_STATUS_QUERY_KEY(nickname),
  queryFn: () => getUserStatus(nickname),
  refetchOnWindowFocus: true,
  refetchInterval: 50000,
  enabled
});