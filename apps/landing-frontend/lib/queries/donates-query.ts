import { useQuery } from '@tanstack/react-query';
import { getDonates } from '#/lib/queries/get-donates.ts';

export const DONATES_QUERY_KEY = ["donates"]

export const donatesQuery = () => useQuery({
  queryKey: DONATES_QUERY_KEY,
  queryFn: () => getDonates(),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})