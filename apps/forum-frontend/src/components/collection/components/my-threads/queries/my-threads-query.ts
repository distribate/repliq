import { getThreadsUser } from "@repo/lib/queries/get-threads-user";
import { useQuery } from "@tanstack/react-query";

export const myThreadsQuery = (nickname: string) => useQuery({
  queryKey: ["my-threads"],
  queryFn: () => getThreadsUser({ nickname })
});