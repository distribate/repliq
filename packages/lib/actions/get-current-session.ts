'use server';

import { SessionValidationResult } from 'authorization/lib/routes/create-session.ts';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { validateSessionToken } from '#actions/validate-requests.ts';

export const getCurrentSession = cache(async(): Promise<SessionValidationResult> => {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value ?? null;
  
  if (token === null) {
    return { session: null, user: null };
  }
  
  const { session, user } = await validateSessionToken(token);
  
  if (!session || !user) {
    return { session: null, user: null }
  }
  
  return { session, user };
});