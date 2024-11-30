'use server';

import { cache } from 'react';
import { validateSession } from '#actions/validate-requests.ts';
import { getCurrentSession } from '#actions/get-current-session.ts';

export const getCurrentUser = cache(async() => {
  await validateSession();
  
  const { user } = await getCurrentSession()
  
  return user;
});