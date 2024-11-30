'use server';

import 'server-only';
import { authClient } from 'authorization';

export async function getUserFromAuthData(nickname: string) {
  const res = await authClient.auth.get[':detail'].$post({
    param: { detail: nickname },
    json: { fields: ['HASH'] }
  });
  
  if (!res.ok) {
    throw new Error('er')
  }
  
  const data = await res.json()
  
  return data.data;
}