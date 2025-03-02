import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";

export const BLOCKED_QUERY_KEY = (requestedNickname: string) =>
  createQueryKey("ui", ["is-blocked"], requestedNickname);

// TODO: implement check profile is blocked
export const blockedUserQuery = (requestedNickname: string) => useQuery({
  queryKey: BLOCKED_QUERY_KEY(requestedNickname),
  queryFn: async () => {
    return {
      recipient: "1",
    }
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});