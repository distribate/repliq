import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRequestsByType } from "#friends/queries/get-requests-by-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REQUESTS_OUTGOING_QUERY_KEY =
  createQueryKey("user", ["friends", "outgoing"]);

export const requestsOutgoingQuery = (enabled: boolean = true) => useQuery({
  queryKey: REQUESTS_OUTGOING_QUERY_KEY,
  queryFn: () => getRequestsByType("outgoing"),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData,
  enabled,
});