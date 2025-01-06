import { useQuery } from "@tanstack/react-query";
import { checkProfileIsBlocked } from "#helpers/check-profile-is-blocked.ts";
import { createQueryKey } from "#helpers/query-key-builder.ts";

export const BLOCKED_QUERY_KEY = (requestedNickname: string) =>
  createQueryKey("ui", ["is-blocked"], requestedNickname);

export const blockedUserQuery = (requestedNickname: string) => useQuery({
  queryKey: BLOCKED_QUERY_KEY(requestedNickname),
  queryFn: () => checkProfileIsBlocked(requestedNickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});