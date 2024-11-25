'use client';

import { useLocalStorage } from '@repo/lib/hooks/use-local-storage.ts';
import { useCallback } from 'react';
import { ThreadHistoryType } from '../types/thread-history-types.ts';
import { usePreferences } from '#cards/components/user-personal-card/components/advanced-settings/hooks/use-preferences.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const SAVED_LAST_THREADS_KEY = 'history-threads';

export const useHistoryThreads = () => {
  const [ value, setValue, removeValue ] = useLocalStorage<ThreadHistoryType[] | null>(
		SAVED_LAST_THREADS_KEY, null
  );
  
  const currentUser = getUser();
  const { preferences } = usePreferences();
  
  const saveThread = useCallback(({
    nickname, title, threadId
  }: Omit<ThreadHistoryType, "id">) => {
    if (!preferences.autoSaveThreads || !currentUser) return;
    
    let threadObjects: ThreadHistoryType[] = value ?? [];
    
    const exists = threadObjects.some(
      item => item.threadId === threadId && item.id === currentUser.nickname
    );
    
    if (exists) return;
    
    if (threadObjects.length < 3) {
      threadObjects = [
        ...threadObjects,
        { id: currentUser.nickname, threadId, nickname, title },
      ];
    } else {
      threadObjects = [
        ...threadObjects.slice(1),
        { id: currentUser.nickname, threadId, nickname, title },
      ];
    }
    
    setValue(threadObjects);
  }, [ setValue, value, preferences.autoSaveThreads, currentUser ]);
  
  const deleteThread = ({
    threadId
  }: Pick<ThreadHistoryType, 'threadId'>) => {
    if (!currentUser) return;
    
    if (!value) return;
    
    const threadObjects = value.filter(
      item => item.threadId !== threadId && item.id === currentUser.nickname
    );
    
    if (threadObjects.length === 0) {
      setValue(null);
    } else {
      setValue(threadObjects);
    }
  };
  
  const savedThreads = value ? value.filter(i => i.id === currentUser?.nickname) : null;

  return { saveThread, deleteThread, savedThreads };
};