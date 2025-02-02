import { useQuery } from "@tanstack/react-query"
import { getLandById } from "./get-land"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"

export const LAND_QUERY_KEY = (id: string) => 
  createQueryKey('ui', ["land", id])

export const landQuery = (id: string) => useQuery({
  queryKey: LAND_QUERY_KEY(id),
  queryFn: () => getLandById(id),
  refetchOnWindowFocus: false
})