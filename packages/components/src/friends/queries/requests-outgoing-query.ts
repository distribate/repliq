import { useQuery } from "@tanstack/react-query";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { getRequestsByType } from "#friends/queries/get-requests-by-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REQUESTS_OUTGOING_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends", "outgoing"], nickname);

export const requestsOutgoingQuery = (enabled: boolean = true) => {
  const currentUser = getUser();
  const { nickname } = currentUser;

  return useQuery({
    queryKey: REQUESTS_OUTGOING_QUERY_KEY(nickname),
    queryFn: () => getRequestsByType({ type: "outgoing", nickname }),
    enabled: !!currentUser && enabled,
  });
};
