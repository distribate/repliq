"use client";

import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";
import { useCallback } from "react";
import { ThreadHistoryType } from "../types/thread-history-types.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query.ts";

export const HISTORY_THREADS_KEY = "history-threads";

export const useHistoryThreads = () => {
  const { data: globalPreferences } = globalPreferencesQuery();

  const [_, setValue, __] = useLocalStorage<ThreadHistoryType[] | null>(HISTORY_THREADS_KEY, null, { 
    initializeWithValue : false 
  });
  
  const { autoSaveThreads } = globalPreferences
  const currentUser = getUser()
  
  const saveThread = useCallback(({
    nickname, title, threadId
  }: Omit<ThreadHistoryType, "id">) => {
    if (!currentUser || typeof autoSaveThreads === "undefined") return;

    setValue((prev) => {
      let threadObjects: ThreadHistoryType[] = prev ?? [];

      const exists = threadObjects.some(
        item => item.threadId === threadId && item.id === currentUser.nickname,
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
  }, [setValue, autoSaveThreads, currentUser]);

  const deleteThread = useCallback((threadId: string) => {
    setValue((prev) => {
      if (!prev) return null;

      const threadObjects = prev.filter(
        item => item.threadId !== threadId && item.id === currentUser.nickname,
      );

      return threadObjects.length === 0 ? null : threadObjects;
    });
  }, [setValue, currentUser]);

  return { saveThread, deleteThread };
};