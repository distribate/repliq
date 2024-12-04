import { useQuery } from "@tanstack/react-query";
import { getRequests } from "./get-requests.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REQUESTS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends", "requests"], nickname);

export const requestsQuery = (nickname: string) =>
  useQuery({
    queryKey: REQUESTS_QUERY_KEY(nickname),
    queryFn: () => getRequests(nickname),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
