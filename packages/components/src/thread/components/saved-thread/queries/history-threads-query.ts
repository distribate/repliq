import { getUser } from "@repo/lib/helpers/get-user";
import { ThreadHistoryType } from "../types/thread-history-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HISTORY_THREADS_KEY } from "../hooks/use-history-threads";
import { useReadLocalStorage } from "@repo/lib/hooks/use-read-local-storage";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";

export const historyThreadsQuery = () => {
  const threads = useReadLocalStorage<ThreadHistoryType[] | null>(HISTORY_THREADS_KEY);
  const currentUser = getUser()

  return useSuspenseQuery({
    queryKey: createQueryKey("ui", ["history-threads"]),
    initialData: threads?.filter(i => i.id === currentUser.nickname) ?? null,
  })
}