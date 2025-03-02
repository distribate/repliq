import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";
import { ThreadHistoryType } from "../types/thread-history-types.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_THREADS_QUERY_KEY } from "../queries/history-threads-query.ts";

export const HISTORY_THREADS_KEY = "history-threads";

const MAX_HISTORY = 2;

export const useHistoryThreads = () => {
  const qc = useQueryClient()
  const { data: { autoSaveThreads: preference } } = globalPreferencesQuery();

  const [_, setValue, __] = useLocalStorage<ThreadHistoryType[] | null>(
    HISTORY_THREADS_KEY,
    [],
    {
      initializeWithValue: false
    }
  );

  const { nickname: account } = getUser()

  const saveThread = ({ thread }: Omit<ThreadHistoryType, "account">) => {
    if (!preference) return;

    setValue((prev) => {
      let threadObjects: ThreadHistoryType[] = prev ?? [];

      const exists = threadObjects.some(
        i => i.thread.id === thread.id && i.account === account,
      );

      if (exists) return threadObjects;

      if (threadObjects.length < MAX_HISTORY) {
        const threads = [...threadObjects, { account, thread }]

        qc.setQueryData(HISTORY_THREADS_QUERY_KEY, threads)

        return threads;
      } else {
        const sliced = [...threadObjects.slice(1), { account, thread }]

        qc.setQueryData(HISTORY_THREADS_QUERY_KEY, sliced)

        return sliced;
      }
    });
  }

  const deleteThread = (threadId: string) => {
    setValue((prev) => {
      if (!prev) return null;

      const threadObjects = prev.filter(
        i => !(i.thread.id === threadId && i.account === account)
      );

      const threads = threadObjects.length === 0 ? [] : threadObjects

      qc.setQueryData(HISTORY_THREADS_QUERY_KEY, threads)

      return threads;
    });
  }

  return { saveThread, deleteThread };
};