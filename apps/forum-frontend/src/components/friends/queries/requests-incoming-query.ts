import { useQuery } from "@tanstack/react-query";
import { getRequestsByType } from "#components/friends/queries/get-requests-by-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REQUESTS_INCOMING_QUERY_KEY =
  createQueryKey("user", ["friends", "incoming"]);

export const requestsIncomingQuery = (enabled: boolean = true) => useQuery({
  queryKey: REQUESTS_INCOMING_QUERY_KEY,
  queryFn: () => getRequestsByType("incoming"),
  refetchOnWindowFocus: false,
  enabled,
});