import { useQuery } from "@tanstack/react-query";
import { getUserBlocked } from "./get-user-blocked.ts";

export const USER_BLOCKED_QUERY_KEY = (nickname: string) => [
  "user",
  "blocked",
  nickname,
];

export const userBlockedQuery = (nickname: string) =>
  useQuery({
    queryKey: USER_BLOCKED_QUERY_KEY(nickname),
    queryFn: () => getUserBlocked(nickname),
    refetchOnWindowFocus: false,
  });
