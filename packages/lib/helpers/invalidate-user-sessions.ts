"use client"

import {
  USER_ACTIVE_SESSIONS_QUERY_KEY
} from '@repo/components/src/cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts';
import { useQueryClient } from '@tanstack/react-query';

export async function invalidateUserSessions() {
  const qc = useQueryClient()
  
  return qc.invalidateQueries({
    queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY
  })
}