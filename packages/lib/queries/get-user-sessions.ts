'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { getCurrentUser } from '../actions/get-current-user.ts';
import { validateRequest } from '../utils/auth/validate-requests.ts';
import { UsersSessionEntity } from '@repo/types/entities/entities-type.ts';

export type UserSessions = Omit<UsersSessionEntity, 'id' | 'isBot' | 'expires_at'> & {
  current: boolean
}

export const getUserActiveSessions = async(): Promise<UserSessions[] | null> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const { session: currentSession } = await validateRequest();
  if (!currentSession) return null;
  
  const api = createClient();
  
  let query = api
  .from('users_session')
  .select('user_id, browser, os, ua, cpu, ip, uuid');
  
  const { data, error } = await query
  .eq('user_id', currentUser.id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(session => {
    return {
      ...session,
      current: currentSession.uuid === session.uuid,
    };
  });
};