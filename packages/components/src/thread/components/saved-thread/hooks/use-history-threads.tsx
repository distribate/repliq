'use client';

import { useLocalStorage } from '@repo/lib/hooks/use-local-storage.ts';
import { useCallback } from 'react';
import { ThreadHistoryType } from '../types/thread-history-types.ts';
import {
  usePreferences,
} from '../../../../cards/components/user-personal-card/components/advanced-settings/hooks/use-preferences.ts';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export const SAVED_LAST_THREADS_KEY = 'history-threads';

export const useHistoryThreads = () => {
  const [ value, setValue, removeValue ] = useLocalStorage<ThreadHistoryType[]>(
		SAVED_LAST_THREADS_KEY, []
  );
  
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  const { preferences } = usePreferences();
  
  const saveThread = useCallback(({
    nickname, title, threadId
  }: Omit<ThreadHistoryType, "id">) => {
    if (!preferences.autoSaveThreads || !currentUser) return;
    
    let threadObjects: ThreadHistoryType[];
    
    const exists = value.some(
      item => item.threadId === threadId
        && item.id === currentUser.nickname
    );
    
    if (exists) return;
    
    if (value.length < 3) {
      threadObjects = [
        ...value, {
					id: currentUser.nickname, threadId, nickname, title
	      },
      ];
    } else {
      threadObjects = [
        ...value.slice(1), {
					id: currentUser.nickname, threadId, nickname, title
	      },
      ];
    }
    
    setValue(threadObjects);
  }, [ setValue, value, preferences.autoSaveThreads, currentUser ]);
  
  const deleteThread = ({
    threadId
  }: Pick<ThreadHistoryType, 'threadId'>) => {
    if (!currentUser) return;
    
    const exists = value.some(
      item => item.threadId === threadId
        && item.id === currentUser.nickname
    );
    
    if (!exists) return;
    
    const threadObjects = value.filter(
      item => item.threadId !== threadId && item.id === currentUser.nickname
    );
    
    setValue(threadObjects);
  };
  
  const savedThreads = value.filter(
    i => i.id === currentUser?.nickname
  )
  
  return { saveThread, deleteThread, savedThreads };
};