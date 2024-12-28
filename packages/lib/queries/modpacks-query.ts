import { useQuery } from '@tanstack/react-query';
import { getModpacks } from '@repo/lib/queries/get-modpacks.ts';

export const MODPACKS_QUERY_KEY = ["modpacks"]

export const modpacksQuery = () => useQuery({
  queryKey: MODPACKS_QUERY_KEY,
  queryFn: () => getModpacks(),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})