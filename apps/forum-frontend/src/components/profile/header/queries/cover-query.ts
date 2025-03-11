import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const COVER_QUERY_KEY = createQueryKey("ui", ["cover-state"]);

export type CoverQuery = {
  inView: boolean,
  location: {
    opened: boolean
  }
};

export const initial: CoverQuery = {
  inView: true,
  location: {
    opened: false
  }
};

export const coverQuery = () => useQuery({
  queryKey: COVER_QUERY_KEY,
  initialData: initial,
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
});