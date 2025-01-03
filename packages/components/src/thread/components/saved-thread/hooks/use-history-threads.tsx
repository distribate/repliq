"use client";

import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";
import { useCallback, useMemo } from "react";
import { ThreadHistoryType } from "../types/thread-history-types.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query.ts";

export const SAVED_LAST_THREADS_KEY = "history-threads";

export const useHistoryThreads = () => {
  const [value, setValue, removeValue] = useLocalStorage<ThreadHistoryType[] | null>(SAVED_LAST_THREADS_KEY, null);

  const threads = value ?? null;

  const currentUser = useMemo(() => getUser(), []);
  const { data: globalPreferences } = globalPreferencesQuery();

  const { autoSaveThreads } = globalPreferences

  const saveThread = useCallback(({
    nickname, title, threadId
  }: Omit<ThreadHistoryType, "id">) => {
    if (!autoSaveThreads) return;

    setValue((prev) => {
      let threadObjects: ThreadHistoryType[] = prev ?? [];

      const exists = threadObjects.some(
        (item) =>
          item.threadId === threadId && item.id === currentUser.nickname,
      );

      if (exists) return threadObjects;

      if (threadObjects.length < 3) {
        return [
          ...threadObjects,
          { id: currentUser.nickname, threadId, nickname, title },
        ];
      } else {
        return [
          ...threadObjects.slice(1),
          { id: currentUser.nickname, threadId, nickname, title },
        ];
      }
    });
  }, [setValue, threads, autoSaveThreads, currentUser]);

  const deleteThread = useCallback(({
    threadId
  }: Pick<ThreadHistoryType, "threadId">) => {
    if (!currentUser?.nickname) return;

    setValue((prev) => {
      if (!prev) return null;

      const threadObjects = prev.filter(
        (item) =>
          item.threadId !== threadId && item.id === currentUser.nickname,
      );

      return threadObjects.length === 0 ? null : threadObjects;
    });
  }, [setValue, currentUser]);

  const savedThreads = useMemo(() =>
    value?.filter((i) => i.id === currentUser?.nickname) ?? null,
    [value, currentUser]
  );

  return { saveThread, deleteThread, savedThreads };
};
