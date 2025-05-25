import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getDonates } from '@repo/lib/queries/get-donates.ts';

export const DONATES_QUERY_KEY = (type: "donate" | "wallet" | "events") => ["ui", "donates", type]

export const donatesQuery = (type: "donate" | "wallet" | "events") => useQuery({
  queryKey: DONATES_QUERY_KEY(type),
  queryFn: () => getDonates({ type }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
})