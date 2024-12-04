import { useQuery } from "@tanstack/react-query";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { getRequestsByType } from "#friends/queries/get-requests-by-type.ts";
import { FriendRequestEntity } from "@repo/types/entities/entities-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REQUESTS_INCOMING_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends", "incoming"], nickname);

export const requestsIncomingQuery = (enabled: boolean = true) => {
  const currentUser = getUser();
  const { nickname } = currentUser;

  return useQuery<FriendRequestEntity[], Error>({
    queryKey: REQUESTS_INCOMING_QUERY_KEY(nickname),
    queryFn: () => getRequestsByType({ type: "incoming", nickname }),
    enabled: !!currentUser && enabled,
  });
};
