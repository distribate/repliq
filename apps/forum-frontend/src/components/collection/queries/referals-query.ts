import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { useQuery } from "@tanstack/react-query";
import { getReferals } from "./get-referals";

export const referalsQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey('user', ['referals', nickname]),
  queryFn: () => getReferals(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})