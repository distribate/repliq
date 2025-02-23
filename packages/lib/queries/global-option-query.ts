import { createQueryKey } from "#helpers/query-key-builder.ts"
import { useSuspenseQuery } from "@tanstack/react-query"

export const GLOBAL_OPTION_QUERY_KEY = createQueryKey("ui", ["global-type"])

export type GlobalOptionQuery = {
  isStarted: boolean
}

export const globalOptionQuery = () => useSuspenseQuery<GlobalOptionQuery>({
  queryKey: GLOBAL_OPTION_QUERY_KEY,
  initialData: {
    isStarted: false
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  staleTime: Infinity,
  gcTime: Infinity
})