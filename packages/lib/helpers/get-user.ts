"use client"

import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '#queries/current-user-query.ts';
import { deleteSession } from '#actions/delete-session.ts';
import { getUserInformation } from '#queries/get-user-information.ts';
import { toast } from 'sonner';

export function getUser(): CurrentUser | null {
  const qc = useQueryClient();
  const cacheUser = qc.getQueryData<CurrentUser>(
    CURRENT_USER_QUERY_KEY
  );
  
  if (!cacheUser) {
    toast.error("Произошла ошибка при обновлении информации", {
      description: "Повторите попытку"
    })
    
    qc.fetchQuery<CurrentUser | null>({
      queryKey: CURRENT_USER_QUERY_KEY,
      queryFn: () => getUserInformation(),
      retry: 3
    }).then(res => {
      if (!res) {
        deleteSession().catch(err => {
          console.error('Error deleting session:', err);
        });
      }
    });
  }
  
  return cacheUser!;
}